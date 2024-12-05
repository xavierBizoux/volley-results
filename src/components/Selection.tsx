import { FormControl, MenuItem, Select } from '@mui/material'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'

export type Option = {
    value: string
    label: string
}

type Props = {
    data: Option[]
    defaultValue: string
    handleSelection: React.Dispatch<React.SetStateAction<Option>>
}

const Selection = ({ data, defaultValue, handleSelection }: Props) => {
    const [selected, setSelected] = useState<Option['value']>(defaultValue)
    useEffect(() => {
        const selectedOption = data.find((option) => option.value === defaultValue)
        setSelected(selectedOption!.value)
        data.sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label))
    }, [defaultValue, data])
    return (
        <Box>
            <FormControl fullWidth>
                <Select
                    id='selection'
                    sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        '& .MuiSvgIcon-root': { fill: 'white' },
                    }}
                    value={selected}
                    onChange={(event) => {
                        setSelected(event.target.value as Option['value'])
                        const option = data.find((option) => option.value === event.target.value)!
                        handleSelection(option)
                    }}>
                    {data &&
                        data.map((option) => (
                            <MenuItem
                                key={option.value}
                                selected={selected === option.value}
                                value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
        </Box>
    )
}

export default Selection
