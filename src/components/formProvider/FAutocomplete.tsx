import { useFormContext, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { PropsForm } from '@/utils/interface';

export default function FAutocomplete({ name, options, label, ...other }: PropsForm) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState: { error, invalid } }) => (
        <Autocomplete
          fullWidth
          value={field.value}
          freeSolo
          onChange={(_event, newInputValue) => field.onChange(newInputValue)}
          options={options as (string | number)[]}
          renderInput={(params) => (
            <TextField
              focused
              onChange={(e) => field.onChange(e.target.value)}
              {...params}
              {...other}
              label={label}
              inputRef={ref}
              error={invalid}
              helperText={error?.message}
              variant='outlined'
              fullWidth
              color='secondary'
            />
          )}
        />
      )}
    />
  );
}
