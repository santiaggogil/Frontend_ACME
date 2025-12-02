import { useState } from 'react';
import { RegistroUsuario, type UsuarioBase } from './components/RegistroUsuario';
import { FormularioPaciente, type PacientePayload } from './components/FormularioPaciente';
import { FormularioTerapeuta } from './components/FormularioTerapeuta';
import { PacientesCrud, type Paciente } from './components/PacientesCrud';
import { EditarPaciente } from './components/EditarPaciente';
import { UsuariosList } from './components/UsuariosList';
import { AuthTerapeutaModal } from './components/AuthTerapeutaModal';

type Paso = 'usuario' | 'paciente' | 'terapeuta' | 'fin' | 'lista' | 'editar' | 'usuarios';

export function App() {
  const [paso, setPaso] = useState<Paso>('usuario');
  const [usuario, setUsuario] = useState<UsuarioBase | null>(null);
  const [mensaje, setMensaje] = useState<string>('');
  const [cargando, setCargando] = useState(false);
  const [verPacientes, setVerPacientes] = useState(false);
  const [pacienteEdit, setPacienteEdit] = useState<Paciente | null>(null);
  const [authVisible, setAuthVisible] = useState(false);
  const [authMsg, setAuthMsg] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [pendingPaciente, setPendingPaciente] = useState<Paciente | null>(null);
  const [pendingAction, setPendingAction] = useState<'edit' | 'delete' | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [authName, setAuthName] = useState('');

  type UsuarioListado = { id: string; nombre: string; rol: string; especialidad?: string };
  const parseUsuarios = (json: unknown): UsuarioListado[] => {
    if (Array.isArray(json)) return json as UsuarioListado[];
    if (json && typeof json === 'object') {
      const obj = json as Record<string, any>;
      if (Array.isArray(obj.usuarios)) return obj.usuarios as UsuarioListado[];
      if (Array.isArray(obj.data)) return obj.data as UsuarioListado[];
      if (Array.isArray(obj.items)) return obj.items as UsuarioListado[];
    }
    return [];
  };

  const fetchUsuariosWithFallback = async (): Promise<UsuarioListado[]> => {
    // Intenta /usuarios; si falla o vacío, intenta /data/usuarios.json (si el backend lo expone)
    try {
      const res = await fetch('http://localhost:3000/usuarios');
      if (res.ok) {
        const list = parseUsuarios(await res.json());
        if (list.length > 0) return list;
      }
    } catch {}
    try {
      const res2 = await fetch('http://localhost:3000/data/usuarios.json');
      if (res2.ok) return parseUsuarios(await res2.json());
    } catch {}
    return [];
  };

  const solicitarEdicion = (p: Paciente) => {
    setPendingPaciente(p);
    setPendingAction('edit');
    setAuthMsg('');
    setAuthVisible(true);
  };

  const solicitarEliminacion = (p: Paciente) => {
    setPendingPaciente(p);
    setPendingAction('delete');
    setAuthMsg('');
    setAuthVisible(true);
  };

  const confirmarTerapeuta = async (nombreTerapeuta: string) => {
    try {
      setAuthLoading(true);
      setAuthMsg('');
      const usuarios = await fetchUsuariosWithFallback();
      const ok = usuarios.some((u) =>
        (u.rol || '').toString().toLowerCase() === 'terapeuta' &&
        (u.nombre || '').toString().trim().toLowerCase() === nombreTerapeuta.trim().toLowerCase()
      );
      if (!ok) {
        setAuthMsg('Solo los terapeutas pueden actualizar los pacientes.');
        return;
      }
      setAuthName(nombreTerapeuta.trim());
      if (pendingPaciente && pendingAction === 'edit') {
        setPacienteEdit(pendingPaciente);
        setAuthVisible(false);
        setPaso('editar');
        setPendingPaciente(null);
        setPendingAction(null);
      } else if (pendingPaciente && pendingAction === 'delete') {
        // Ejecutar DELETE y volver a lista
        const resDel = await fetch(
          `http://localhost:3000/pacientes/${encodeURIComponent(pendingPaciente.userId)}`,
          { method: 'DELETE', headers: { 'x-terapeuta-nombre': nombreTerapeuta.trim() } }
        );
        if (!resDel.ok) throw new Error('No se pudo eliminar');
        setAuthVisible(false);
        setPendingPaciente(null);
        setPendingAction(null);
        setPaso('lista');
        setRefreshKey((k) => k + 1);
      }
    } catch (err: any) {
      setAuthMsg(err?.message || 'Error validando terapeuta');
    } finally {
      setAuthLoading(false);
    }
  };

  const crearUsuario = async (data: UsuarioBase) => {
    if (data.rol === 'terapeuta') {
      // Primero pedimos la especialidad, luego haremos el POST /usuarios
      setUsuario(data);
      setPaso('terapeuta');
      return;
    }

    // Paciente: crear usuario inmediatamente, luego mostrar ficha paciente
    try {
      setCargando(true);
      setMensaje('');
      const res = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: data.id, nombre: data.nombre, rol: 'paciente' }),
      });
      if (!res.ok) throw new Error('No se pudo crear el usuario');
      setUsuario(data);
      setPaso('paciente');
    } catch (err: any) {
      setMensaje(err?.message || 'Error creando usuario');
    } finally {
      setCargando(false);
    }
  };

  const guardarPaciente = async (payload: PacientePayload) => {
    try {
      setCargando(true);
      setMensaje('');
      const res = await fetch('http://localhost:3000/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('No se pudo crear la ficha del paciente');
      // Ir a la página de lista y refrescar para ver el nuevo paciente
      setPaso('lista');
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      setMensaje(err?.message || 'Error guardando paciente');
    } finally {
      setCargando(false);
    }
  };

  const crearTerapeuta = async (payload: { id: string; nombre: string; rol: 'terapeuta'; especialidad: string }) => {
    try {
      setCargando(true);
      setMensaje('');
      const res = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('No se pudo crear el terapeuta');
      setMensaje('Terapeuta registrado correctamente.');
      // Navegar a usuarios para ver el nuevo terapeuta
      setPaso('usuarios');
    } catch (err: any) {
      setMensaje(err?.message || 'Error creando terapeuta');
    } finally {
      setCargando(false);
    }
  };

  const reset = () => {
    setPaso('usuario');
    setUsuario(null);
    setMensaje('');
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
          <div>
            <h1>Registro ACME</h1>
          </div>
          <div className="actions">
            <button className="btn btn-ghost" onClick={() => setPaso('usuario')}>Registrar</button>
            <button className="btn btn-ghost" onClick={() => setPaso('lista')}>Pacientes</button>
            <button className="btn btn-ghost" onClick={() => setPaso('usuarios')}>Usuarios</button>
          </div>
        </header>

        {mensaje && (
          <div className="msg" role="status">
            {mensaje}
          </div>
        )}

        {paso === 'usuario' && <RegistroUsuario onSubmit={crearUsuario} />}

        {paso === 'paciente' && usuario && usuario.rol === 'paciente' && (
          <FormularioPaciente
            userId={usuario.id}
            nombreInicial={usuario.nombre}
            onSubmit={guardarPaciente}
            onCancel={reset}
          />
        )}

        {paso === 'terapeuta' && usuario && usuario.rol === 'terapeuta' && (
          <FormularioTerapeuta
            baseUsuario={usuario as UsuarioBase & { rol: 'terapeuta' }}
            onSubmit={crearTerapeuta}
            onCancel={reset}
          />
        )}

        {paso === 'fin' && (
          <div className="card" style={{ display: 'grid', gap: 12 }}>
            <strong>Proceso finalizado.</strong>
            <div className="actions">
              <button className="btn btn-primary" onClick={reset}>Registrar otro</button>
            </div>
          </div>
        )}

        {cargando && <p className="footer-note">Procesando...</p>}

        {paso === 'lista' && (
          <PacientesCrud
            key={refreshKey}
            rol={usuario?.rol === 'terapeuta' ? 'terapeuta' : 'lectura'}
            onEdit={solicitarEdicion}
            onDelete={solicitarEliminacion}
          />
        )}

        {paso === 'editar' && pacienteEdit && (
          <EditarPaciente
            data={pacienteEdit}
            authName={authName}
            onCancel={() => setPaso('lista')}
            onSaved={() => {
              setPaso('lista');
              setRefreshKey((k) => k + 1);
            }}
          />
        )}

        {paso === 'usuarios' && <UsuariosList />}
      </div>

      {authVisible && (
        <AuthTerapeutaModal
          onConfirm={confirmarTerapeuta}
          onCancel={() => {
            setAuthVisible(false);
            setPendingPaciente(null);
            setPendingAction(null);
          }}
          loading={authLoading}
          message={authMsg}
        />
      )}
    </div>
  );
}

