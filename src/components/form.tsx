"use client";

import { useEffect, useContext, useState } from "react";
import BalDataContext from "@/contexts/bal-data";
import useKeyEvent from "@/hooks/key-event";
import FormContainer from "@/components/form-container";

interface FormProps {
  editingId?: string | null;
  closeForm?: () => void;
  onFormSubmit: (e: any) => Promise<void>;
  children: React.ReactNode;
}

function Form({ editingId, closeForm, onFormSubmit, children }: FormProps) {
  const [initialized, setInitialized] = useState(false);
  const { setEditingId, setIsEditing, isEditing } = useContext(BalDataContext);

  useKeyEvent(
    ({ key }) => {
      if (key === "Escape") {
        closeForm();
      }
    },
    [closeForm],
    "keyup",
  );

  useEffect(() => {
    if (initialized && !isEditing) {
      closeForm();
    }
  }, [isEditing, closeForm, initialized]);

  useEffect(() => {
    setIsEditing(true);
    if (editingId) {
      setEditingId(editingId);
    }
    setInitialized(true);

    return () => {
      setIsEditing(false);
      setEditingId(null);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FormContainer
      display="flex"
      flexDirection="column"
      height="100%"
      maxHeight="100%"
      width="100%"
      position="absolute"
      overflowY="scroll"
      zIndex={1}
      onSubmit={onFormSubmit}
    >
      {children}
    </FormContainer>
  );
}

export default Form;
