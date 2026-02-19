import React, { useState, useRef, useEffect } from 'react';

function UpiInput({ value, onChange, placeholder, className }) {
  const [local, setLocal] = useState(value || '');
  const ref = useRef(null);
  const isFocused = useRef(false);

  console.debug('[UpiInput] render', { value, local, isFocused: isFocused.current });

  useEffect(() => {
    console.debug('[UpiInput] mount');
    return () => console.debug('[UpiInput] unmount');
  }, []);

  // Only sync if focused elsewhere changed the value externally
  useEffect(() => {
    if (!isFocused.current && value !== local) {
      setLocal(value || '');
    }
  }, [value, local]);

  const handleChange = (e) => {
    console.debug('[UpiInput] typing:', e.target.value);
    setLocal(e.target.value);
  };

  const handleFocus = () => {
    isFocused.current = true;
    console.debug('[UpiInput] focus');
  };

  const handleBlur = (e) => {
    isFocused.current = false;
    console.debug('[UpiInput] blur, syncing:', local);
    onChange?.(local);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.debug('[UpiInput] enter key, syncing:', local);
      onChange?.(local);
    }
  };

  return (
    <input
      ref={ref}
      type="text"
      value={local}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={className || 'w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-stone-500'}
      inputMode="text"
      spellCheck={false}
      autoComplete="off"
    />
  );
}

export default React.memo(UpiInput);
