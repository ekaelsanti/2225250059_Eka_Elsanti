import CartesianPlane from './CartesianPlane.jsx';
import Illus from './Illus.jsx';
import NumberLine from './NumberLine.jsx';

// emoji pada data materi diganti ilustrasi berwarna
const EMOJI_ILLUS = { '🪜': 'tangga', '⛰️': 'gunung', '🛝': 'perosotan' };

/** Menampilkan visual materi: bidang Kartesius, garis bilangan, atau ilustrasi emoji. */
export default function Visual({ visual }) {
  if (!visual) return null;
  if (visual.type === 'plane') {
    const { type: _t, ...props } = visual;
    return <CartesianPlane integerGrid {...props} />;
  }
  if (visual.type === 'numberline') return <NumberLine start={visual.start} jump={visual.jump} caption={visual.caption} />;
  if (visual.type === 'emoji') {
    return (
      <div className="emoji-row">
        {visual.items.map(([emoji, label]) => (
          <div key={label} className="emoji-card">
            {EMOJI_ILLUS[emoji] ? <Illus name={EMOJI_ILLUS[emoji]} size={56} /> : <span aria-hidden="true">{emoji}</span>}
            <span>{label}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}
