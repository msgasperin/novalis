import { postJSON } from "../globals.js";   // ajusta ruta según tu proyecto

export const obtiene_pacientes = async () => {
   const datos = { func: 'obtiene_pacientes' };
   let respuesta = await postJSON('../api/controller/pacientes.php', datos);
   return respuesta;
}

export const obtiene_credenciales_pacientes = async (idPaciente) => {
   const datos = { func: 'obtiene_credenciales_pacientes', idPaciente };
   let respuesta = await postJSON('../api/controller/pacientes.php', datos);
   return respuesta;
}

export const valida_coincidencia_paciente = async (objPaciente) => {   
   let respuesta = await postJSON('../api/controller/pacientes.php', objPaciente);
   return respuesta;
};

export const guardar_paciente = async (objPaciente) => {   
   let respuesta = await postJSON('../api/controller/pacientes.php', objPaciente);
   return respuesta;
};

export const eliminar_paciente = async (idPaciente, nomPaciente) => {
   const datos = { func: 'eliminar_paciente', idPaciente, nomPaciente };
   let respuesta = await postJSON('../api/controller/pacientes.php', datos);
   return respuesta;
}

export const cambiar_credenciales = async (idPaciente, nomPaciente, apPaterno) => {
   const datos = { func: 'cambiar_credenciales', idPaciente, nomPaciente, apPaterno };
   let respuesta = await postJSON('../api/controller/pacientes.php', datos);
   return respuesta;
}

export const busca_paciente_coincidencia = async (parametro) => {
   const datos = { func: 'busca_paciente_coincidencia', parametro };
   let respuesta = await postJSON('../api/controller/pacientes.php', datos);
   return respuesta;
}

export const busca_paciente_fecha_nac = async (fecha) => {
   const datos = { func: 'busca_paciente_fecha_nac', fecha };
   let respuesta = await postJSON('../api/controller/pacientes.php', datos);
   return respuesta;
}