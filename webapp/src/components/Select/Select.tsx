import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { FormikProps } from 'formik'

export const SelectInput = ({
  items,
  formik,
  name,
  lable,
}: {
  items: { name: string; id: string; description: string }[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikProps<any>
  name: string
  lable: string
}) => {
  const value = formik.values[name]

  const handleChange = (event: SelectChangeEvent) => {
    formik.setFieldValue(name, event.target.value)
  }

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id={lable}>{lable}</InputLabel>
        <Select labelId={lable} id={name} value={value} onChange={handleChange} autoWidth label={lable}>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {items.map((item, index) => (
            <MenuItem key={index} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}
