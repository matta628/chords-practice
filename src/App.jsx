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
import { useCallback, useEffect, useState, useMemo } from 'react';
import MusicSlider from './components/MusicSlider';
import Chord from '@tombatossals/react-chords/lib/Chord';

function App() {
    const notes = useMemo(() => {
        /*
        A
        E
        F
        F#
        G
        G#

        A#
        B
        C
        C#
        D
        D#
        */
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

    const generateChords = useCallback(() => {
        const rawChords = [];
        for (let i = 0; i < notes.length; i++) {
            const note = notes[i];
            rawChords.push(note + 'major');
            rawChords.push(note + 'minor');
            rawChords.push(note + '7');
            rawChords.push(note + 'maj7');
            rawChords.push(note + 'm7');
        }
        // rawChords.push('G6');
        // rawChords.push('Gsus4');
        // rawChords.push('Dsus2');
        // rawChords.push('Cadd9');
        // rawChords.push('Asus4');
        // rawChords.push('Em9/A');
        // rawChords.push('Em9');
        // rawChords.push('Esus4');
        return rawChords;
    }, [notes]);

    const [chordsMap, setChordsMap] = useState(() => {
        const chords = generateChords();
        const chordsDict = {};
        chords.forEach((chord) => {
            // chordsDict[chord] = true;
            chordsDict[chord] = {};
            chordsDict[chord].selected = true;
        });
        return chordsDict;
    }, [generateChords]);

    const [open, setOpen] = useState(false);
    const [bpm, setBpm] = useState(60);
    const [reps, setReps] = useState(4);
    const msPerChord = 60000.0 / bpm;
    const [a, setA] = useState('C');
    const [b, setB] = useState('G');
    const [prevChord, setPrevChord] = useState('');
    const [currentChord, setCurrentChord] = useState('');
    const [nextChord, setNextChord] = useState('');
    const [beatNo, setBeatNo] = useState(0);
    const [patternIdx, setPatternIdx] = useState(1);
    const [underline, setUnderline] = useState(false);

    const exChord = {
        frets: [1, 3, 3, 2, 1, 1],
        fingers: [1, 3, 4, 2, 1, 1],
        barres: [1],
        capo: false,
    };

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
                    .filter(([, isSelected]) => isSelected)
                    .map(([chord]) => chord);
                const newChord =
                    selectedChords[
                        Math.floor(Math.random() * selectedChords.length)
                    ];

                setPatternIdx((patternIdx + 1) % 4);
                if (patternIdx == 0) {
                    setA(newChord);
                    setB(a);
                }
                setNextChord(patternIdx % 2 == 0 ? b : a);
                setCurrentChord(nextChord);
                setPrevChord(currentChord);
            }

            setTimeout(() => {
                setUnderline(true);
            }, msPerChord / 2.0);
            setTimeout(() => {
                setUnderline(false);
            }, (3 * msPerChord) / 4.0);
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
        underline,
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
            [chord]: !chordsMap[chord],
        });
    };

    const assignAllChords = (isSelected) => {
        setChordsMap(() => {
            const newChordsMap = {};
            Object.keys(chordsMap).forEach(
                (chord) => (newChordsMap[chord] = isSelected)
            );
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
                                Object.keys(chordsMap).map((chord) => {
                                    return (
                                        <Grid key={chord} size={12 / 10} item>
                                            <FormControlLabel
                                                label={chord}
                                                style={{ color: '#f7e4d2' }}
                                                control={
                                                    <Checkbox
                                                        onChange={() =>
                                                            toggleChordSelect(
                                                                chord
                                                            )
                                                        }
                                                        checked={
                                                            chordsMap[chord]
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
                justifyContent="center"
                alignItems="center"
            >
                <Stack
                    direction="row"
                    justifyContent="space-evenly"
                    width="100%"
                >
                    <Stack alignItems="center" justifyContent="center">
                        <Typography variant="h5">{prevChord}</Typography>
                    </Stack>
                    <Stack alignItems="center" justifyContent="center">
                        <Typography
                            variant="h4"
                            sx={{
                                textDecoration: underline ? 'underline' : '',
                            }}
                        >
                            {currentChord}
                        </Typography>
                        <Chord chord={exChord} instrument={instrument} />
                    </Stack>
                    <Stack alignItems="center" justifyContent="center">
                        <Typography variant="h5">{nextChord}</Typography>
                    </Stack>
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
