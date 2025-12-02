import { useEffect, useState } from 'react';

type Usuario = {
  id: string;
  nombre: string;
  rol: 'paciente' | 'terapeuta';
  especialidad?: string;
};

function parseUsuarios(json: unknown): Usuario[] {
  if (Array.isArray(json)) return json as Usuario[];
  if (json && typeof json === 'object') {
    const obj = json as Record<string, any>;
    if (Array.isArray(obj.usuarios)) return obj.usuarios as Usuario[];
    if (Array.isArray(obj.data)) return obj.data as Usuario[];
    if (Array.isArray(obj.items)) return obj.items as Usuario[];
  }
  return [];
}

export function UsuariosList() {
  const [items, setItems] = useState<Usuario[]>([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const cargar = async () => {
    try {
      setLoading(true);
      setMsg('');
      const res = await fetch('http://localhost:3000/usuarios');
      if (!res.ok) throw new Error('No se pudo listar usuarios');
      const json = await res.json();
      setItems(parseUsuarios(json));
    } catch (err: any) {
      setMsg(err?.message || 'Error listando usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar usuario?')) return;
    try {
      setLoading(true);
      setMsg('');
      const res = await fetch(`http://localhost:3000/usuarios/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('No se pudo eliminar');
      setMsg('Usuario eliminado');
      await cargar();
    } catch (err: any) {
      setMsg(err?.message || 'Error eliminando');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card" style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Usuarios</h2>
        <div className="actions">
          <button className="btn btn-ghost" onClick={cargar}>Refrescar</button>
        </div>
      </div>

      {msg && <div className="msg">{msg}</div>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Especialidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.rol}</td>
                <td>{u.rol === 'terapeuta' ? u.especialidad || '-' : '-'}</td>
                <td>
                  <div className="actions">
                    <button className="btn btn-ghost" onClick={() => eliminar(u.id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: '0.75rem' }}>
                  No hay usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && <span className="footer-note">Cargando...</span>}
    </section>
  );
}
