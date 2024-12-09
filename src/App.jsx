import {
    Box,
    Stack,
    Typography,
    IconButton,
    Drawer,
    Paper,
    Checkbox,
    FormControlLabel,
    Button,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import MenuIcon from '@mui/icons-material/Menu';
import './App.css';
import { useEffect, useState, useMemo } from 'react';
import MusicSlider from './components/MusicSlider';
import Chord from '@tombatossals/react-chords/lib/Chord';
import guitar from './assets/guitar.json';

function App() {
    const notes = useMemo(() => {
        return [
            'E',
            'A#',
            'F',
            'B',
            'F#',
            'C',
            'G',
            'C#',
            'G#',
            'D',
            'A',
            'D#',
        ];
    }, []);

    const [chordsMap, setChordsMap] = useState(() => {
        const chordsDict = {};
        notes.forEach((note) => {
            ['major', 'minor', '7', 'maj7', 'm7'].forEach((suffix) => {
                if (Array.isArray(guitar.chords[note])) {
                    const chordInfo = guitar.chords[note].filter(
                        (chordFlavor) => chordFlavor.suffix === suffix
                    );
                    if (chordInfo.length > 0) {
                        const fullName = note + suffix;
                        const label =
                            suffix === 'major'
                                ? note
                                : suffix === 'minor'
                                ? note + 'm'
                                : fullName;

                        const firstPosition = chordInfo[0].positions[0];
                        chordsDict[fullName] = {
                            isSelected: true,
                            label: label,
                            position: firstPosition,
                            suffix: suffix,
                        };
                    }
                }
            });
        });
        return chordsDict;
    }, [notes]);

    const [open, setOpen] = useState(false);
    const [bpm, setBpm] = useState(120);
    const [reps, setReps] = useState(8);
    const msPerChord = 60000.0 / bpm;
    const [a, setA] = useState(chordsMap['Cmajor']);
    const [b, setB] = useState(chordsMap['Gmajor']);
    const [prevChord, setPrevChord] = useState(chordsMap['Emajor']);
    const [currentChord, setCurrentChord] = useState(chordsMap['Amajor']);
    const [nextChord, setNextChord] = useState(chordsMap['Dmajor']);
    const [beatNo, setBeatNo] = useState(0);
    const [patternIdx, setPatternIdx] = useState(1);

    const instrument = {
        strings: 6,
        fretsOnChord: 4,
        name: 'Guitar',
        keys: [],
        tunings: {
            standard: ['E', 'A', 'D', 'G', 'B', 'E'],
        },
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setBeatNo((beatNo + 1) % reps);
            if (beatNo == 0) {
                const chordsEntries = Object.entries(chordsMap);
                const selectedChords = chordsEntries
                    .filter(([, chordObj]) => chordObj.isSelected)
                    .map(([chord]) => chord);
                const newChord =
                    selectedChords[
                        Math.floor(Math.random() * selectedChords.length)
                    ];

                setPatternIdx((patternIdx + 1) % 4);
                if (patternIdx == 0) {
                    setA(chordsMap[newChord]);
                    setB(a);
                }
                setNextChord(patternIdx % 2 == 0 ? b : a);
                setCurrentChord(nextChord);
                setPrevChord(currentChord);
            }
        }, msPerChord);
        return () => {
            clearInterval(intervalId);
        };
    }, [
        chordsMap,
        currentChord,
        msPerChord,
        nextChord,
        reps,
        beatNo,
        a,
        b,
        patternIdx,
    ]);

    const toggleDrawer = (isOpen) => {
        setOpen(isOpen);
    };

    const toggleChordSelect = (chord) => {
        setChordsMap({
            ...chordsMap,
            [chord]: {
                ...chordsMap[chord],
                isSelected: !chordsMap[chord].isSelected,
            },
        });
    };

    const assignAllChords = (isSelected) => {
        setChordsMap(() => {
            const newChordsMap = {};
            Object.keys(chordsMap).forEach((chord) => {
                newChordsMap[chord] = {
                    ...chordsMap[chord],
                    isSelected: isSelected,
                };
            });
            return newChordsMap;
        });
    };
    const selectAllSuffixChords = (suffix) => {
        setChordsMap(() => {
            const newChordsMap = {};
            Object.keys(chordsMap).forEach((chord) => {
                newChordsMap[chord] = {
                    ...chordsMap[chord],
                    isSelected:
                        chordsMap[chord].isSelected ||
                        chordsMap[chord].suffix === suffix,
                };
            });
            return newChordsMap;
        });
    };

    return (
        <Stack sx={{ height: '100vh' }}>
            <Stack direction="row" justifyContent="flex-end">
                <Drawer
                    anchor="top"
                    open={open}
                    onClose={() => toggleDrawer(false)}
                >
                    <Paper
                        sx={{
                            backgroundColor: '#1c1c26',
                            borderRadius: '0px',
                            height: '100%',
                            padding: '2vh',
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="h4" color="#f7e4d2">
                                Select Chords
                            </Typography>
                            <Stack direction="row">
                                {['major', 'minor', '7', 'maj7', 'm7'].map(
                                    (suffix) => {
                                        return (
                                            <Button
                                                key={suffix}
                                                onClick={() =>
                                                    selectAllSuffixChords(
                                                        suffix
                                                    )
                                                }
                                            >
                                                {'Select ' + suffix}
                                            </Button>
                                        );
                                    }
                                )}
                                <Button onClick={() => assignAllChords(true)}>
                                    Select All
                                </Button>
                                <Button onClick={() => assignAllChords(false)}>
                                    Deselect All
                                </Button>
                            </Stack>
                        </Stack>
                        <Grid container spacing={1}>
                            {chordsMap &&
                                Object.keys(chordsMap).map((chordKey) => {
                                    const chord = chordsMap[chordKey];

                                    return (
                                        <Grid
                                            key={chord.label}
                                            size={12 / 10}
                                            item
                                        >
                                            <FormControlLabel
                                                label={chord.label}
                                                style={{ color: '#f7e4d2' }}
                                                control={
                                                    <Checkbox
                                                        onChange={() =>
                                                            toggleChordSelect(
                                                                chordKey
                                                            )
                                                        }
                                                        checked={
                                                            chord.isSelected
                                                        }
                                                    />
                                                }
                                            />
                                        </Grid>
                                    );
                                })}
                        </Grid>
                    </Paper>
                </Drawer>
                <IconButton onClick={() => toggleDrawer(true)}>
                    <MenuIcon sx={{ color: '#f7e4d2' }} />
                </IconButton>
            </Stack>
            <Box display="flex" justifyContent="center" padding="5vh">
                <Typography variant="h3">Chords Practice</Typography>
            </Box>
            <Box
                margin="0vh 15vw"
                border="1px solid white"
                height="50vh"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                gap="3vh"
            >
                <Stack
                    direction="row"
                    justifyContent="space-evenly"
                    width="100%"
                >
                    <Stack alignItems="center" justifyContent="center">
                        <Typography variant="h5">{prevChord.label}</Typography>
                        <Chord
                            chord={prevChord.position}
                            instrument={instrument}
                        />
                    </Stack>
                    <Stack alignItems="center" justifyContent="center">
                        <Typography variant="h4">
                            {currentChord.label}
                        </Typography>
                        <Chord
                            chord={currentChord.position}
                            instrument={instrument}
                        />
                    </Stack>
                    <Stack alignItems="center" justifyContent="center">
                        <Typography variant="h5">{nextChord.label}</Typography>
                        <Chord
                            chord={nextChord.position}
                            instrument={instrument}
                        />
                    </Stack>
                </Stack>
                <Stack direction="row">
                    <Typography variant="h4">
                        {((beatNo + reps - 1) % reps) + 1}
                    </Typography>
                </Stack>
            </Box>
            <Stack
                direction="row"
                justifyContent="space-evenly"
                padding="5vh 0vh"
            >
                <MusicSlider
                    value={bpm}
                    setValue={setBpm}
                    min={20}
                    max={180}
                    label="BPM"
                />
                <MusicSlider
                    value={reps}
                    setValue={setReps}
                    min={1}
                    max={16}
                    label="Reps"
                />
            </Stack>
        </Stack>
    );
}

export default App;
