import { useState } from 'react';

export interface PacientePayload {
  userId: string;
  nombre: string;
  apellidos: string;
  documento: string;
  edad: number;
  ciudadResidencia: string;
  diagnostico: string;
  antecedentes: string;
}

export function FormularioPaciente({
  userId,
  nombreInicial,
  onSubmit,
  onCancel,
}: {
  userId: string;
  nombreInicial: string;
  onSubmit: (data: PacientePayload) => void;
  onCancel?: () => void;
}) {
  const [nombre, setNombre] = useState(nombreInicial);
  const [apellidos, setApellidos] = useState('');
  const [documento, setDocumento] = useState('');
  const [edad, setEdad] = useState<number | ''>('');
  const [ciudadResidencia, setCiudadResidencia] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [antecedentes, setAntecedentes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !nombre ||
      !apellidos ||
      !documento ||
      edad === '' ||
      !ciudadResidencia ||
      !diagnostico ||
      !antecedentes
    )
      return;

    onSubmit({
      userId,
      nombre,
      apellidos,
      documento,
      edad: Number(edad),
      ciudadResidencia,
      diagnostico,
      antecedentes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card form">
      <h2>Ficha de Paciente</h2>
      <div className="field">
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="apellidos">Apellidos</label>
        <input
          id="apellidos"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="documento">Documento</label>
        <input
          id="documento"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="edad">Edad</label>
        <input
          id="edad"
          type="number"
          min={0}
          value={edad}
          onChange={(e) => setEdad(e.target.value === '' ? '' : Number(e.target.value))}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="ciudadResidencia">Ciudad de Residencia</label>
        <input
          id="ciudadResidencia"
          value={ciudadResidencia}
          onChange={(e) => setCiudadResidencia(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="diagnostico">Diagnóstico</label>
        <input
          id="diagnostico"
          value={diagnostico}
          onChange={(e) => setDiagnostico(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="antecedentes">Antecedentes</label>
        <input
          id="antecedentes"
          value={antecedentes}
          onChange={(e) => setAntecedentes(e.target.value)}
          required
        />
      </div>
      <div className="actions">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary">Guardar Paciente</button>
      </div>
    </form>
  );
}

