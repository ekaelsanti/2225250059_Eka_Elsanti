// Spanduk pembuka tiap menu: warna senada kartu menu di Beranda + ilustrasi besar.
import Illus from './Illus.jsx';

/**
 * @param {{ tone: string, illus: string, title: string, text?: string, children?: any }} props
 */
export default function PageBanner({ tone, illus, title, text, children }) {
  return (
    <section className={`page-banner tone-${tone}`}>
      <div className="pb-text">
        <h2>{title}</h2>
        {text && <p>{text}</p>}
        {children}
      </div>
      <Illus name={illus} size={76} className="pb-art" />
    </section>
  );
}
