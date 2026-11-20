// Layar login: pilih Siswa atau Guru, lalu masukkan PIN (sama untuk keduanya).
import { useState } from 'react';
import { go } from '../app/router.js';
import { PINS, login } from '../app/session.js';
import Gradi from '../components/Gradi.jsx';
import Icon from '../components/Icon.jsx';
import { APP_TEXT, LOGIN_TEXT } from '../content/strings.id.js';
import Illus from '../components/Illus.jsx';

export default function LoginScreen() {
  const [role, setRole] = useState(null);
  const [pin, setPin] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!role) {
      setError(LOGIN_TEXT.chooseRole);
      return;
    }
    if (!login(role, pin)) {
      setError(LOGIN_TEXT.wrongPin);
      setPin('');
      return;
    }
    go(role === 'guru' ? '/guru' : '/');
  };

  return (
    <div className="login">
      <form className="login-card" onSubmit={submit} noValidate>
        <div className="login-head">
          <Gradi size={78} showName={false} />
          <div>
            <p className="login-app">{APP_TEXT.appName}</p>
            <h1>{LOGIN_TEXT.title}</h1>
            <p className="muted">{LOGIN_TEXT.subtitle}</p>
          </div>
        </div>

        <fieldset className="role-pick">
          <legend>{LOGIN_TEXT.roleLabel}</legend>
          {Object.entries(LOGIN_TEXT.roles).map(([key, r]) => (
            <label key={key} className={`role-card ${role === key ? 'on' : ''}`}>
              <input type="radio" name="role" value={key} checked={role === key}
                onChange={() => {
                  setRole(key);
                  setError('');
                }} />
              <span className="role-icon" aria-hidden="true">{r.icon}</span>
              <strong>{r.name}</strong>
              <small>{r.desc}</small>
            </label>
          ))}
        </fieldset>

        <label className="pin-field">
          <span className="answer-label">{LOGIN_TEXT.pinLabel}</span>
          <span className="row">
            <input type={show ? 'text' : 'password'} autoComplete="off" autoCapitalize="none" spellCheck={false} maxLength={20}
              value={pin} placeholder={LOGIN_TEXT.pinPlaceholder} aria-label={LOGIN_TEXT.pinLabel}
              onChange={(e) => {
                setPin(e.target.value);
                setError('');
              }} />
            <button type="button" className="btn" aria-pressed={show} onClick={() => setShow(!show)}>
              <Icon name={show ? 'eyeOff' : 'eye'} size={22} /> <span className="sr-only">{show ? LOGIN_TEXT.hidePin : LOGIN_TEXT.showPin}</span>
            </button>
          </span>
        </label>
        <p className="pin-info"><Illus name="kunci" size={20} className="ico" /> {LOGIN_TEXT.pinInfo(PINS)}</p>

        {error && (
          <p className="fb warn" role="alert">
            <Illus name="awas" size={20} className="ico" /> {error}
          </p>
        )}

        <button type="submit" className="btn primary login-submit">
          {role ? LOGIN_TEXT.submit(LOGIN_TEXT.roles[role].name) : LOGIN_TEXT.submit('…')}
        </button>
      </form>
    </div>
  );
}
