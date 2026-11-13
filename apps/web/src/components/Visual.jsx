import CartesianPlane from './CartesianPlane.jsx';
import NumberLine from './NumberLine.jsx';

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
            <span aria-hidden="true">{emoji}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}
