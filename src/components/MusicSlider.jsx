/* eslint-disable react/prop-types */
import { Box, Stack, Typography, Slider } from '@mui/material';
const MusicSlider = ({ value, setValue, min, max, label }) => {
    return (
        <Box
            border="2px solid white"
            width="30vh"
            height="15vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="5px"
        >
            <Stack width="100%" alignItems="center" padding="1vw">
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="flex-end"
                >
                    <Typography variant="h5">
                        {label}: {value}
                    </Typography>
                </Stack>
                <Slider
                    value={value}
                    onChange={(events, newVal) => setValue(newVal)}
                    min={min}
                    max={max}
                ></Slider>
            </Stack>
        </Box>
    );
};

export default MusicSlider;
