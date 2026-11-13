import { AnswerInput, ChoiceQuestion } from './Help.jsx';

/** Pertanyaan singkat materi/kuis: angka atau pilihan ganda. */
export default function CheckItem({ item, onSolved }) {
  if (item.type === 'choice') {
    return <ChoiceQuestion question={item.q} options={item.options} answer={item.answer} explain={item.explain} onSolved={() => onSolved?.(true)} />;
  }
  return <AnswerInput label={item.q} expected={item.answer} hints={item.hints} onSolved={onSolved} />;
}
