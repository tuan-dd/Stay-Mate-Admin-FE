import { useFormContext, Controller } from 'react-hook-form';
import { FormHelperText } from '@mui/material';
import { DropzoneOptions } from 'react-dropzone';
import { PropsForm } from '@/utils/interface';
import UploadImages from '../UpLoadImages';

function FUploadImages({ name, helperText, ...other }: PropsForm & DropzoneOptions) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error || !field.value;
        const handleDelete = (i: number) => {
          const value = (field.value as any[]).filter((_e, index) => index !== i);
          field.onChange(value);
        };
        return (
          <UploadImages
            files={field.value}
            error={checkError}
            handleDelete={handleDelete}
            helperText={
              checkError ? (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error?.message}
                </FormHelperText>
              ) : undefined
            }
            {...other}
          />
        );
      }}
    />
  );
}

export default FUploadImages;
