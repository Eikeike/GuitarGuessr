import React from 'react'
import PropTypes from 'prop-types'
import Neck from '../../src/Chord/Neck'
import Dot from '../../src/Chord/Dot'
import Barre from '../../src/Chord/Barre'
import { instrumentPropTypes } from '../../src/Chord/propTypes'
import Svg, {
  Circle,
  Ellipse,
  G,
  Text,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
} from 'react-native-svg';

const onlyDots = chord =>
  chord.frets
  .map((f, index) => ({ position: index, value: f }))
  .filter(f => !chord.barres || chord.barres.indexOf(f.value) === -1)

const Chord = ({ chord, instrument, lite }) =>
  chord ? <Svg
    width='250'
    height='250'
    preserveAspectRatio='xMinYMin meet'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 80 70'>
    <G
      transform='translate(15, 15)'>
      <Neck
        tuning={instrument.tunings.standard}
        strings={instrument.strings}
        frets={chord.frets}
        capo={chord.capo}
        fretsOnChord={instrument.fretsOnChord}
        baseFret={chord.baseFret}
        lite={lite}
      />
      {chord.barres && chord.barres.map((barre, index) =>
        <Barre
          key={index}
          capo={index === 0 && chord.capo}
          barre={barre}
          finger={chord.fingers && chord.fingers[chord.frets.indexOf(barre)]}
          frets={chord.frets}
          lite={lite}
        />)}
      {onlyDots(chord).map(fret => (
        <Dot
          key={fret.position}
          string={instrument.strings - fret.position}
          fret={fret.value}
          strings={instrument.strings}
          finger={chord.fingers && chord.fingers[fret.position]}
          lite={lite}
        />
      ))}
    </G>
  </Svg> : null

Chord.propTypes = {
  chord: PropTypes.any,
  instrument: instrumentPropTypes,
  lite: PropTypes.bool
}

Chord.defaultProps = {
  lite: false
}

export default Chord
