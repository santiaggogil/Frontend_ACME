import { useEffect, useMemo, useState } from 'react';

export type Paciente = {
  userId: string;
  nombre: string;
  apellidos: string;
  documento: string;
  edad: number;
  ciudadResidencia: string;
  diagnostico: string;
  antecedentes: string;
};

type RolActual = 'terapeuta' | 'lectura';

export function PacientesCrud({
  rol = 'lectura',
  onEdit,
  onDelete,
}: {
  rol?: RolActual;
  onEdit?: (p: Paciente) => void;
  onDelete?: (p: Paciente) => void;
}) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<string>('');
  const [editing, setEditing] = useState<Paciente | null>(null);

  const puedeEliminar = useMemo(() => rol !== 'terapeuta', [rol]);
  const puedeEditar = useMemo(() => true, []); // todos pueden ver botón editar; regla se aplica en PUT si es terapeuta

  const cargar = async () => {
    try {
      setCargando(true);
      setMensaje('');
      const res = await fetch('http://localhost:3000/pacientes');
      if (!res.ok) throw new Error('No se pudo listar pacientes');
      const json = await res.json();
      const data: unknown = json;
      let list: Paciente[] = [];
      if (Array.isArray(data)) {
        list = data as Paciente[];
      } else if (data && typeof data === 'object') {
        const obj = data as Record<string, any>;
        if (Array.isArray(obj.pacientes)) list = obj.pacientes as Paciente[];
        else if (Array.isArray(obj.data)) list = obj.data as Paciente[];
        else if (Array.isArray(obj.items)) list = obj.items as Paciente[];
      }
      setPacientes(list);
    } catch (err: any) {
      setMensaje(err?.message || 'Error cargando pacientes');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const iniciarEdicion = (p: Paciente) => {
    if (onEdit) return onEdit(p);
    setEditing(p);
  };
  const cancelarEdicion = () => setEditing(null);

  const guardarEdicion = async (p: Paciente) => {
    try {
      setCargando(true);
      setMensaje('');
      const res = await fetch(`http://localhost:3000/pacientes/${encodeURIComponent(p.userId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      });
      if (!res.ok) throw new Error('No se pudo actualizar el paciente');
      setMensaje('Paciente actualizado correctamente');
      setEditing(null);
      await cargar();
    } catch (err: any) {
      setMensaje(err?.message || 'Error actualizando');
    } finally {
      setCargando(false);
    }
  };

  const eliminar = async (userId: string) => {
    if (!puedeEliminar) return;
    if (!confirm('¿Eliminar ficha de paciente?')) return;
    try {
      setCargando(true);
      setMensaje('');
      const res = await fetch(`http://localhost:3000/pacientes/${encodeURIComponent(userId)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('No se pudo eliminar');
      setMensaje('Paciente eliminado');
      await cargar();
    } catch (err: any) {
      setMensaje(err?.message || 'Error eliminando');
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="card" style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Pacientes</h2>
        <div className="actions">
          <button className="btn btn-ghost" onClick={cargar}>Refrescar</button>
        </div>
      </div>

      {mensaje && <div className="msg">{mensaje}</div>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>UserID</th>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Edad</th>
              <th>Ciudad</th>
              <th>Dx</th>
              <th>Antecedentes</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p) => (
              <tr key={p.userId}>
                <td>{p.userId}</td>
                <td>{p.nombre} {p.apellidos}</td>
                <td>{p.documento}</td>
                <td>{p.edad}</td>
                <td>{p.ciudadResidencia}</td>
                <td>{p.diagnostico}</td>
                <td>{p.antecedentes}</td>
                <td>
                  <div className="actions">
                    {puedeEditar && (
                      <button className="btn btn-primary" onClick={() => iniciarEdicion(p)}>Editar</button>
                    )}
                    {puedeEliminar && (
                      <button
                        className="btn btn-ghost"
                        onClick={() => (onDelete ? onDelete(p) : eliminar(p.userId))}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {pacientes.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#64748b', padding: '0.75rem' }}>
                  No hay pacientes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditorPaciente
          key={editing.userId}
          data={editing}
          onCancel={cancelarEdicion}
          onSave={guardarEdicion}
          soloActualizar={rol === 'terapeuta'}
        />
      )}

      {cargando && <span className="footer-note">Cargando...</span>}
    </section>
  );
}

function EditorPaciente({
  data,
  onCancel,
  onSave,
  soloActualizar,
}: {
  data: Paciente;
  onCancel: () => void;
  onSave: (p: Paciente) => void;
  soloActualizar?: boolean; // si es terapeuta, solo actualiza; igual hacemos PUT completo
}) {
  const [form, setForm] = useState<Paciente>({ ...data });

  const change = (k: keyof Paciente, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v } as Paciente));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, edad: Number(form.edad) });
  };

  return (
    <form onSubmit={submit} className="card form">
      <h3>Editar paciente ({form.userId})</h3>
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
        <button type="submit" className="btn btn-primary">Guardar</button>
      </div>
    </form>
  );
}
