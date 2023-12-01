import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";

export interface FormItem {
  name: string;
  type: string;
  placeholder: string;
}

export default function InputForm(props: {
  submitFunction: any;
  formItems: FormItem[];
  onClose: () => void;
  refetch?: any;
  id?: number;
}) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const { submitFunction, formItems, onClose, refetch, id } = props;

  const mutation = submitFunction.useMutation();

  const formSchema = formItems.reduce((acc, item) => {
    return { ...acc, [item.name]: "" };
  }, {});
  type formSchemaType = typeof formSchema;

  const onSubmit = async (values: formSchemaType) => {
    // convert values to number if needed
    let valuesToSubmit = Object.entries(values).reduce((acc, [key, value]) => {
      if (key === "model" || key === "vin") return { ...acc, [key]: value };
      const valueToSubmit = isNaN(Number(value)) ? value : Number(value);
      return { ...acc, [key]: valueToSubmit };
    }, {});
    if (id) {
      // if id exists, add it to the valuesToSubmit
      console.log("id", id);
      valuesToSubmit = { ...valuesToSubmit, id: id };
    }
    await mutation.mutate(valuesToSubmit);
    refetch();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-black">
      <FormControl isInvalid={errors.name ? true : false}>
        {formItems.map((item, index) => {
          return (
            <div key={index}>
              <FormLabel htmlFor={item.name}>{item.name}</FormLabel>
              <Input
                type={item.type}
                id={item.name}
                placeholder={item.placeholder}
                {...register(item.name)}
              />
              <FormErrorMessage>
                {errors.name ? errors.name.message?.toString() : ""}
              </FormErrorMessage>
            </div>
          );
        })}
      </FormControl>
      <Button
        mt={4}
        colorScheme="teal"
        isLoading={isSubmitting}
        type="submit"
        onClick={onClose}
      >
        Submit
      </Button>
    </form>
  );
}
