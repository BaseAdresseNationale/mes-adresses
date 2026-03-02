import { Pane, SearchInput, SearchInputOwnProps, Text } from "evergreen-ui";
import { useCallback, useRef, useState } from "react";
import style from "./autocomplete.module.css";
import {
  useCombobox,
  UseComboboxState,
  UseComboboxStateChangeOptions,
} from "downshift";
import { useDebouncedCallback } from "use-debounce";

export type SearchItemType<T> = T & {
  label: string;
  id: string;
  header?: string;
  details?: string;
};

type SearchInputProps<T> = SearchInputOwnProps & {
  onSearch: (
    inputValue: string,
    signal: AbortSignal
  ) => Promise<SearchItemType<T>[]>;
  onSelect: (selectedItem?: SearchItemType<T> | null) => void;
  onError?: (error: Error) => void;
  itemToString?: (item?: SearchItemType<T> | null) => string;
  label?: string;
};

function AutocompleteInput<T>({
  onSearch,
  onSelect,
  onError,
  itemToString = (item) => (item ? item.label : ""),
  label,
  ...inputProps
}: SearchInputProps<T>) {
  const controller = useRef<AbortController | null>(null);
  const [items, setItems] = useState<SearchItemType<T>[]>([]);
  const [_isLoading, setIsLoading] = useState(false);

  const onSearchAsync = useCallback(
    async (...args: [string, AbortSignal]) => {
      setIsLoading(true);
      const results = await onSearch(...args);
      setIsLoading(false);
      return results;
    },
    [onSearch]
  );

  const onInputValueChange = useDebouncedCallback(
    async ({ inputValue }: { inputValue: string }) => {
      if (controller.current) {
        controller.current.abort();
      }

      controller.current = new AbortController();

      try {
        const results = await onSearchAsync(
          inputValue.trim(),
          controller.current.signal
        );
        setItems(results);
      } catch (err: unknown) {
        if (onError) {
          onError(err as Error);
        }
      }
    },
    300
  );

  const stateReducer = useCallback<
    (
      state: unknown,
      actionAndChanges: UseComboboxStateChangeOptions<SearchItemType<T>>
    ) => Partial<UseComboboxState<SearchItemType<T>>>
  >(
    (state, actionAndChanges) => {
      const { type, changes } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          return {
            ...changes,
            inputValue: (changes.inputValue as string).trimStart(),
          };
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
          const selectedValue = changes.selectedItem;
          onSelect(selectedValue);
          return {
            ...changes,
            ...(selectedValue
              ? {
                  inputValue: selectedValue.id,
                }
              : null),
          };
        default:
          return changes;
      }
    },
    [onSelect]
  );

  const {
    highlightedIndex,
    selectedItem,
    getMenuProps,
    getInputProps,
    getItemProps,
    isOpen,
    getLabelProps,
  } = useCombobox<SearchItemType<T>>({
    onInputValueChange,
    items,
    itemToString,
    stateReducer,
  });

  return (
    <Pane className={style.autocomplete} position="relative" width="100%">
      {label && <label {...getLabelProps()}>{label}</label>}
      {isOpen && (
        <Pane
          is="ul"
          overflow="hidden"
          position="absolute"
          bottom={0}
          transform="translateY(-32px)"
          width="100%"
          zIndex={1}
          maxHeight={200}
          overflowY="auto"
          background="white"
          borderTopLeftRadius={3}
          borderTopRightRadius={3}
          boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
          {...getMenuProps()}
        >
          {items.length === 0 ? (
            <Pane is="li" padding={8}>
              <Text fontSize={12} color="muted">
                Aucune parcelle ne correspond à votre recherche
              </Text>
            </Pane>
          ) : (
            items.map((item, index) => (
              <Pane
                is="li"
                key={item.id}
                className={`${style.itemBtn}  ${selectedItem?.id === item.id || highlightedIndex === index ? style.selected : ""}`}
                {...getItemProps({ item, index })}
              >
                <Text fontSize={12} color="muted">
                  {itemToString(item)}
                </Text>
              </Pane>
            ))
          )}
        </Pane>
      )}
      <SearchInput {...inputProps} {...getInputProps()} />
    </Pane>
  );
}

export default AutocompleteInput;
