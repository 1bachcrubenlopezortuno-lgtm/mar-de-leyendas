/* =========================================================================
   CANCIONES
   Notación 'Nota/duración' en corcheas, '-' silencio, '|' separador visual.
   ========================================================================= */
const SONGS={
 sea:{bpm:200,lead:'D4/2 A4 A4/2 G4 F4/2 E4 D4/3 | C4/2 E4 G4/2 A4 G4/2 F4 E4/3 | D4/2 A4 A4/2 G4 F4/2 G4 A4/3 | C5/2 A4 G4/2 E4 D4/6 | F4/2 G4 A4/2 C5 D5/3 C5/3 | A4/2 G4 F4/2 E4 F4/6 | G4/2 A4 Bb4/2 A4 G4/2 F4 E4/3 | F4/2 E4 D4/9',
   bass:'D3/6 A2/6 | C3/6 G2/6 | D3/6 A2/6 | A2/6 D3/6 | Bb2/6 F3/6 | C3/6 F2/6 | G2/6 C3/6 | D3/6 A2/6',drums:'k--h--s--h--',leadType:'triangle',leadVol:.16},
 island:{bpm:236,lead:'E5 G5 C6/2 G5 E5 D5/2 | C5 D5 E5 G5 A5/2 G5/2 | F5 A5 C6/2 A5 F5 E5/2 | D5 E5 F5 D5 G5/4 | E5 G5 C6/2 D6 C6 B5/2 | A5 B5 C6 A5 G5/4 | F5 E5 D5/2 G5 F5 E5/2 | D5 B4 D5 G5 C5/4',
   bass:'C3/2 G3/2 C3/2 G3/2 | A2/2 E3/2 A2/2 E3/2 | F2/2 C3/2 F2/2 C3/2 | G2/2 D3/2 G2/2 B2/2 | C3/2 G3/2 E3/2 G3/2 | F2/2 C3/2 F2/2 A2/2 | D3/2 A2/2 G2/2 D3/2 | G2/2 B2/2 C3/4',drums:'k-h-s-h-',leadType:'square',leadVol:.09},
 battle:{bpm:300,lead:'A4 A4 C5 A4 E5/2 D5 C5 | B4 B4 D5 B4 E5/2 G#4/2 | A4 A4 C5 A4 F5/2 E5 D5 | E5 D5 C5 B4 A4/4 | C5 E5 A5/2 G5 F5 E5/2 | D5 F5 A5/2 G5 E5 C5/2 | B4 D5 G5/2 F5 E5 D5/2 | E5/2 G#4/2 B4/2 E5/2',
   bass:'A2 A2 A3 A2 A2 A2 A3 A2 | E2 E2 E3 E2 E2 E2 E3 E2 | F2 F2 F3 F2 F2 F2 F3 F2 | E2 E2 E3 E2 E2 E2 G#2 E2 | A2 A2 A3 A2 A2 A2 A3 A2 | D2 D2 D3 D2 D2 D2 D3 D2 | G2 G2 G3 G2 G2 G2 G3 G2 | E2 E2 E3 E2 E2 E2 E3 E2',drums:'k-hsk-hs',leadType:'square',leadVol:.09},
 boss:{bpm:320,lead:'E4/2 F4 E4 G4/2 F4 E4 | E4/2 F4 E4 B4/2 A4 G4 | C5/2 B4 A4 G4/2 F4 E4 | F4 E4 D#4 E4 E5/4 | E5/2 D5 C5 B4/2 C5 D5 | E5/2 F5 E5 D5/4 | C5/2 B4 A4 B4/2 G4 F4 | E4 F4 G4 F4 E4/4',
   bass:'E2 E2 E2 E2 E2 E2 F2 E2 | E2 E2 E2 E2 E2 E2 F2 E2 | A1 A1 A1 A1 A1 A1 B1 A1 | C2 C2 C2 C2 B1 B1 B1 B1 | E2 E2 E2 E2 E2 E2 F2 E2 | D2 D2 D2 D2 D2 D2 E2 D2 | A1 A1 A1 A1 A1 A1 B1 A1 | B1 B1 B1 B1 B1 B1 D#2 B1',drums:'k-skk-s-',leadType:'sawtooth',leadVol:.07}
};
