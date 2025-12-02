import { useState } from 'react';
import type { Paciente } from './PacientesCrud';

export function EditarPaciente({
  data,
  authName,
  onCancel,
  onSaved,
}: {
  data: Paciente;
  authName: string;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Paciente>({ ...data });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const change = (k: keyof Paciente, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v } as Paciente));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMsg('');
      const res = await fetch(`http://localhost:3000/pacientes/${encodeURIComponent(form.userId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-terapeuta-nombre': authName },
        body: JSON.stringify({ ...form, edad: Number(form.edad) }),
      });
      if (!res.ok) throw new Error('No se pudo actualizar el paciente');
      setMsg('Paciente actualizado correctamente');
      onSaved();
    } catch (err: any) {
      setMsg(err?.message || 'Error actualizando');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card" style={{ display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0 }}>Editar paciente ({form.userId})</h2>
      {msg && <div className="msg">{msg}</div>}
      <form onSubmit={submit} className="form">
        <div className="field">
          <label>Nombre</label>
          <input value={form.nombre} onChange={(e) => change('nombre', e.target.value)} required />
        </div>
        <div className="field">
          <label>Apellidos</label>
          <input value={form.apellidos} onChange={(e) => change('apellidos', e.target.value)} required />
        </div>
        <div className="field">
          <label>Documento</label>
          <input value={form.documento} onChange={(e) => change('documento', e.target.value)} required />
        </div>
        <div className="field">
          <label>Edad</label>
          <input type="number" min={0} value={form.edad} onChange={(e) => change('edad', Number(e.target.value))} required />
        </div>
        <div className="field">
          <label>Ciudad de Residencia</label>
          <input value={form.ciudadResidencia} onChange={(e) => change('ciudadResidencia', e.target.value)} required />
        </div>
        <div className="field">
          <label>Diagnóstico</label>
          <input value={form.diagnostico} onChange={(e) => change('diagnostico', e.target.value)} required />
        </div>
        <div className="field">
          <label>Antecedentes</label>
          <input value={form.antecedentes} onChange={(e) => change('antecedentes', e.target.value)} required />
        </div>
        <div className="actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>Guardar</button>
        </div>
      </form>
      {loading && <span className="footer-note">Guardando...</span>}
    </section>
  );
}
