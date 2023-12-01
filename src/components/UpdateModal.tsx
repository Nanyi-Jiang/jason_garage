import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import InputForm, { type FormItem } from "./InputForm";

export const UpdateModal = (props: {
  tableName: string;
  formInputs: FormItem[];
  submitFunction: any;
  refetch?: any;
  id: number;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { tableName, formInputs, submitFunction, refetch, id } = props;
  return (
    <>
      <Button onClick={onOpen}>Update a {tableName} record</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputForm
              formItems={formInputs}
              submitFunction={submitFunction}
              onClose={onClose}
              refetch={refetch}
              id={id}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
