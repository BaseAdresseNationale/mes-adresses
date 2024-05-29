import { useState } from "react";
import { Text, Strong, Icon, CaretUpIcon, CaretDownIcon } from "evergreen-ui";

interface TextWrapperProps {
  placeholder?: string;
  isOpenDefault?: boolean;
  children: React.ReactNode;
}

function TextWrapper({
  placeholder = "En savoir plus",
  isOpenDefault = false,
  children,
}: TextWrapperProps) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  return (
    <>
      <Text
        display="flex"
        alignItems="center"
        textDecoration="underline"
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Strong fontSize={12}>{placeholder}</Strong>
        <Icon icon={isOpen ? CaretUpIcon : CaretDownIcon} />
      </Text>

      {isOpen && children}
    </>
  );
}

export default TextWrapper;
