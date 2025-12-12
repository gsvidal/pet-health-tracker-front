import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Cargar variables de entorno desde .env.development o .env
// Vite usa .env.development en modo desarrollo
const envDevelopmentPath = path.join(process.cwd(), '.env.development');
const envPath = path.join(process.cwd(), '.env');

if (fs.existsSync(envDevelopmentPath)) {
  dotenv.config({ path: envDevelopmentPath });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Colores para la terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const log = {
  step: (msg: string) => console.log(`${colors.cyan}→${colors.reset} ${msg}`),
  success: (msg: string) =>
    console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  title: (msg: string) =>
    console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
};

interface PetData {
  name: string;
  species: string;
  breed?: string | null;
  birth_date?: string | null;
  weight_kg?: string | null;
  sex?: string | null;
  notes?: string | null;
}

// Datos de mascotas predefinidas para demo
const DEMO_PETS = [
  {
    name: 'Brian',
    species: 'perro',
    breed: 'Labrador Retriever blanco',
    birth_date: '2020-03-15',
    weight_kg: '20.5',
    sex: 'macho',
    notes:
      'Muy juguetón y amigable. Le encanta jugar con el más pequeño de la familia.',
  },
  {
    name: 'Pusheen',
    species: 'gato',
    breed: 'Atigrado',
    birth_date: '2021-07-22',
    weight_kg: '4.2',
    sex: 'macho',
    notes: 'Tranquilo y cariñoso. Le gusta comer',
  },
  {
    name: 'Firulais',
    species: 'perro',
    breed: 'Única',
    birth_date: '2019-11-08',
    weight_kg: '14.8',
    sex: 'macho',
    notes: 'Energético y leal. Requiere ejercicio diario.',
  },
  {
    name: 'Alejo',
    species: 'conejo',
    breed: 'Holandés',
    birth_date: '2022-01-30',
    weight_kg: '2.1',
    sex: 'macho',
    notes: 'Muy activo y curioso. Le gusta saltar y explorar.',
  },
  {
    name: 'Mariana',
    species: 'iguana',
    breed: 'Iguana Verde',
    birth_date: '2021-05-18',
    weight_kg: '1.8',
    sex: 'hembra',
    notes: 'Tranquila y observadora. Le gusta tomar el sol.',
  },
];

// Fecha base fija para datos determinísticos (ajusta según tu demo day)
// Todas las fechas se calcularán relativas a esta fecha
const DEMO_BASE_DATE = '2025-12-12'; // Cambia esta fecha según tu demo day

// Función para hacer login
async function login(
  apiUrl: string,
  email: string,
  password: string,
): Promise<string> {
  try {
    log.step('Iniciando sesión...');
    const response = await axios.post(
      `${apiUrl}/auth/login`,
      {
        email,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const accessToken = response.data.access_token || response.data.accessToken;
    if (!accessToken) {
      throw new Error('No se recibió token de acceso en la respuesta');
    }

    log.success('Login exitoso ✓');
    return accessToken;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`,
      );
    }
    throw error;
  }
}

// Función para crear una mascota
async function createPet(
  apiUrl: string,
  token: string,
  petData: PetData,
): Promise<any> {
  try {
    const response = await axios.post(`${apiUrl}/pets`, petData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`,
      );
    }
    throw error;
  }
}

// Función helper para hacer peticiones autenticadas
async function apiRequest(
  apiUrl: string,
  token: string,
  method: 'post' | 'put' | 'delete',
  endpoint: string,
  data?: any,
): Promise<any> {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    let response;
    if (method === 'post') {
      response = await axios.post(`${apiUrl}${endpoint}`, data, config);
    } else if (method === 'put') {
      response = await axios.put(`${apiUrl}${endpoint}`, data, config);
    } else {
      response = await axios.delete(`${apiUrl}${endpoint}`, config);
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`,
      );
    }
    throw error;
  }
}

// Función para crear vacuna
async function createVaccine(
  apiUrl: string,
  token: string,
  petId: string,
  vaccineData: {
    vaccineName: string;
    dateAdministered: string;
    nextDue?: string | null;
    veterinarian?: string | null;
    manufacturer?: string | null;
    lotNumber?: string | null;
    notes?: string | null;
  },
): Promise<any> {
  const payload = {
    pet_id: petId,
    vaccine_name: vaccineData.vaccineName,
    date_administered: vaccineData.dateAdministered,
    next_due: vaccineData.nextDue || null,
    veterinarian: vaccineData.veterinarian || null,
    manufacturer: vaccineData.manufacturer || null,
    lot_number: vaccineData.lotNumber || null,
    notes: vaccineData.notes || null,
  };

  return apiRequest(apiUrl, token, 'post', '/vaccinations', payload);
}

// Función para crear desparasitación
async function createDeworming(
  apiUrl: string,
  token: string,
  petId: string,
  dewormingData: {
    medication?: string | null;
    dateAdministered: string;
    nextDue?: string | null;
    veterinarian?: string | null;
    notes?: string | null;
  },
): Promise<any> {
  const payload = {
    pet_id: petId,
    date_administered: dewormingData.dateAdministered,
    medication: dewormingData.medication || null,
    next_due: dewormingData.nextDue || null,
    veterinarian: dewormingData.veterinarian || null,
    notes: dewormingData.notes || null,
  };

  return apiRequest(apiUrl, token, 'post', '/dewormings', payload);
}

// Función para crear visita veterinaria
async function createVetVisit(
  apiUrl: string,
  token: string,
  petId: string,
  visitData: {
    visitDate: string; // ISO string
    reason?: string | null;
    diagnosis?: string | null;
    treatment?: string | null;
    followUpDate?: string | null; // ISO string
    veterinarian?: string | null;
  },
): Promise<any> {
  const payload = {
    pet_id: petId,
    visit_date: visitData.visitDate,
    reason: visitData.reason || null,
    diagnosis: visitData.diagnosis || null,
    treatment: visitData.treatment || null,
    follow_up_date: visitData.followUpDate || null,
    veterinarian: visitData.veterinarian || null,
  };

  return apiRequest(apiUrl, token, 'post', '/vet-visits', payload);
}

// Función para crear registro de nutrición
async function createMeal(
  apiUrl: string,
  token: string,
  mealData: {
    petId: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    type: string;
    food: string;
    quantity: string;
    notes: string;
  },
): Promise<any> {
  const description = `${mealData.type} - ${mealData.food} (${mealData.quantity})${mealData.notes ? ` | ${mealData.notes}` : ''}`;

  const payload = {
    pet_id: mealData.petId,
    meal_time: `${mealData.date}T${mealData.time}:00`,
    description: description,
    calories: null,
    plan_id: null,
  };

  return apiRequest(apiUrl, token, 'post', '/meals', payload);
}

// Función para crear recordatorio
async function createReminder(
  apiUrl: string,
  token: string,
  reminderData: {
    title: string;
    description?: string | null;
    eventTime: string; // ISO string
    timezone?: string;
    frequency?: string;
    petId?: string | null;
    isActive?: boolean;
    notifyByEmail?: boolean;
    notifyInApp?: boolean;
  },
): Promise<any> {
  const payload = {
    title: reminderData.title,
    description: reminderData.description || '',
    event_time: reminderData.eventTime,
    timezone: reminderData.timezone || 'UTC',
    frequency: reminderData.frequency || 'once',
    rrule: '',
    is_active:
      reminderData.isActive !== undefined ? reminderData.isActive : true,
    notify_by_email:
      reminderData.notifyByEmail !== undefined
        ? reminderData.notifyByEmail
        : true,
    notify_in_app:
      reminderData.notifyInApp !== undefined ? reminderData.notifyInApp : true,
    pet_id: reminderData.petId || null,
  };

  return apiRequest(apiUrl, token, 'post', '/reminders/', payload);
}

// Función helper para calcular fechas
function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function addMonths(date: string, months: number): string {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}

function toISOString(date: string, time: string = '10:00'): string {
  return `${date}T${time}:00`;
}

// Función para crear registros de salud para una mascota
async function createHealthRecords(
  apiUrl: string,
  token: string,
  petId: string,
  petName: string,
  petSpecies: string,
  isHealthy: boolean, // true = saludable, false = atención requerida
): Promise<void> {
  log.title(`📋 Creando registros para ${petName}...`);

  // Usar fecha base fija para datos determinísticos
  const today = DEMO_BASE_DATE;
  const oneMonthAgo = addMonths(today, -1);
  const twoMonthsAgo = addMonths(today, -2);
  const fourMonthsAgo = addMonths(today, -4);
  const sixMonthsAgo = addMonths(today, -6);
  const oneMonthFromNow = addMonths(today, 1);
  const threeMonthsFromNow = addMonths(today, 3);
  const sixMonthsFromNow = addMonths(today, 6);
  const oneYearAgo = addMonths(today, -12);

  try {
    // VACUNAS
    log.step('Creando vacunas...');
    // Solo crear vacunas para perros y gatos (otros animales no tienen vacunas estándar)
    if (petSpecies === 'perro' || petSpecies === 'gato') {
      if (isHealthy) {
        // Mascota saludable: vacunas al día
        await createVaccine(apiUrl, token, petId, {
          vaccineName: petSpecies === 'perro' ? 'Rabia' : 'Triple Felina',
          dateAdministered: twoMonthsAgo,
          nextDue: sixMonthsFromNow,
          veterinarian: 'Dr. García',
          manufacturer: 'Zoetis',
          notes: 'Aplicada correctamente, sin reacciones adversas.',
        });
        log.success('  ✓ Vacuna creada');

        await createVaccine(apiUrl, token, petId, {
          vaccineName: petSpecies === 'perro' ? 'DHPP' : 'Leucemia Felina',
          dateAdministered: fourMonthsAgo,
          nextDue: threeMonthsFromNow,
          veterinarian: 'Dr. García',
          manufacturer: 'Merial',
          notes: 'Refuerzo anual aplicado.',
        });
        log.success('  ✓ Segunda vacuna creada');
      } else {
        // Mascota con atención requerida: vacunas vencidas
        await createVaccine(apiUrl, token, petId, {
          vaccineName: petSpecies === 'perro' ? 'Rabia' : 'Triple Felina',
          dateAdministered: oneYearAgo,
          nextDue: sixMonthsAgo, // Vencida
          veterinarian: 'Dr. Martínez',
          manufacturer: 'Zoetis',
          notes: '⚠️ Vacuna vencida, requiere refuerzo urgente.',
        });
        log.success('  ✓ Vacuna (vencida) creada');
      }
    } else {
      log.info('  ℹ No se crean vacunas para esta especie');
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    // DESPARASITACIONES
    // Mariana (iguana) no tiene registros para estado "Revisión Necesaria"
    if (petName === 'Mariana' && petSpecies === 'iguana') {
      log.info(
        '  ℹ No se crean desparasitaciones para Mariana (Revisión Necesaria)',
      );
    } else {
      log.step('Creando desparasitaciones...');
      if (isHealthy) {
        // Mascota saludable: desparasitaciones recientes
        await createDeworming(apiUrl, token, petId, {
          medication: 'Praziquantel + Pirantel',
          dateAdministered: twoMonthsAgo,
          nextDue: oneMonthFromNow,
          veterinarian: 'Dr. García',
          notes: 'Desparasitación rutinaria, sin parásitos detectados.',
        });
        log.success('  ✓ Desparasitación creada');
      } else {
        // Mascota con atención requerida: desparasitación atrasada
        await createDeworming(apiUrl, token, petId, {
          medication: 'Fenbendazol',
          dateAdministered: sixMonthsAgo,
          nextDue: fourMonthsAgo, // Vencida
          veterinarian: 'Dr. Martínez',
          notes: '⚠️ Desparasitación atrasada, requiere aplicación urgente.',
        });
        log.success('  ✓ Desparasitación (atrasada) creada');
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    // VISITAS VETERINARIAS
    // Mariana (iguana) no tiene visitas recientes para estado "Revisión Necesaria"
    if (petName === 'Mariana' && petSpecies === 'iguana') {
      log.info(
        '  ℹ No se crean visitas veterinarias para Mariana (Revisión Necesaria)',
      );
    } else {
      log.step('Creando visitas veterinarias...');
      if (isHealthy) {
        // Mascota saludable: visita de control normal
        await createVetVisit(apiUrl, token, petId, {
          visitDate: toISOString(twoMonthsAgo, '14:30'),
          reason: 'Control de rutina',
          diagnosis: 'Estado de salud óptimo',
          treatment: 'Ninguno requerido',
          veterinarian: 'Dr. García',
        });
        log.success('  ✓ Visita veterinaria creada');
      } else {
        // Mascota con atención requerida: visita por problema
        await createVetVisit(apiUrl, token, petId, {
          visitDate: toISOString(oneMonthAgo, '16:00'),
          reason: 'Consulta por pérdida de apetito',
          diagnosis: 'Posible infección gastrointestinal',
          treatment: 'Antibióticos y dieta blanda por 5 días',
          followUpDate: toISOString(today, '10:00'),
          veterinarian: 'Dr. Martínez',
        });
        log.success('  ✓ Visita veterinaria (con seguimiento) creada');
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    // NUTRICIÓN (últimos 7 días)
    log.step('Creando registros de nutrición...');
    const mealTypes = ['Desayuno', 'Almuerzo', 'Cena'];
    let foods: string[];
    let quantity: string;

    if (petSpecies === 'perro') {
      foods = [
        'Croquetas Premium',
        'Pollo cocido',
        'Arroz con pollo',
        'Pescado',
      ];
      quantity = '250g';
    } else if (petSpecies === 'gato') {
      foods = ['Pienso seco', 'Atún', 'Pollo cocido', 'Salmón'];
      quantity = '80g';
    } else if (petSpecies === 'conejo') {
      foods = [
        'Heno de alfalfa',
        'Verduras frescas (lechuga, zanahoria)',
        'Pellets de conejo',
        'Frutas (manzana, pera)',
        'Hojas verdes (espinaca, acelga)',
        'Hierbas frescas',
      ];
      quantity = '100g';
    } else if (petSpecies === 'iguana') {
      foods = [
        'Verduras de hoja verde (col, espinaca)',
        'Frutas (papaya, mango)',
        'Flores comestibles',
        'Verduras mixtas',
        'Calabaza',
        'Zanahoria rallada',
      ];
      quantity = '120g';
    } else {
      foods = ['Alimento genérico'];
      quantity = '100g';
    }

    for (let i = 0; i < 7; i++) {
      const mealDate = addDays(today, -i);
      const mealType = mealTypes[i % 3];
      const food = foods[Math.floor(Math.random() * foods.length)];

      await createMeal(apiUrl, token, {
        petId,
        date: mealDate,
        time:
          mealType === 'Desayuno'
            ? '08:00'
            : mealType === 'Almuerzo'
              ? '13:00'
              : '19:00',
        type: mealType,
        food,
        quantity,
        notes: i === 0 ? 'Apetito normal' : '',
      });
    }
    log.success('  ✓ 7 registros de nutrición creados');

    await new Promise((resolve) => setTimeout(resolve, 300));

    // RECORDATORIOS
    // Mariana (iguana) no tiene recordatorios porque no tiene registros de salud
    if (petName === 'Mariana' && petSpecies === 'iguana') {
      log.info(
        '  ℹ No se crean recordatorios para Mariana (Revisión Necesaria)',
      );
    } else {
      log.step('Creando recordatorios...');
      await createReminder(apiUrl, token, {
        title: `Vacunación anual - ${petName}`,
        description: `Recordatorio para vacunación anual de ${petName}`,
        eventTime: toISOString(oneMonthFromNow, '10:00'),
        petId,
        frequency: 'once',
      });
      log.success('  ✓ Recordatorio de vacunación creado');

      await createReminder(apiUrl, token, {
        title: `Desparasitación - ${petName}`,
        description: `Recordatorio para desparasitación de ${petName}`,
        eventTime: toISOString(oneMonthFromNow, '14:00'),
        petId,
        frequency: 'once',
      });
      log.success('  ✓ Recordatorio de desparasitación creado');

      if (!isHealthy) {
        // Recordatorio urgente para mascota con atención requerida
        await createReminder(apiUrl, token, {
          title: `⚠️ Seguimiento veterinario - ${petName}`,
          description: `Seguimiento médico requerido para ${petName}`,
          eventTime: toISOString(today, '09:00'),
          petId,
          frequency: 'once',
        });
        log.success('  ✓ Recordatorio de seguimiento creado');
      }
    }

    log.success(`✓ Todos los registros de ${petName} creados exitosamente`);
  } catch (error: any) {
    log.error(`✗ Error al crear registros para ${petName}: ${error.message}`);
    // Continuar con la siguiente mascota aunque haya error
  }
}

// Función principal
async function main() {
  const startTime = Date.now(); // Capturar tiempo de inicio
  log.title('🐾 Crear Nueva Mascota - Demo Day');

  // Obtener configuración desde .env
  const apiUrl = process.env.VITE_API_URL;
  if (!apiUrl) {
    log.error('VITE_API_URL no encontrado en .env');
    log.info('Por favor, agrega VITE_API_URL a tu archivo .env');
    process.exit(1);
  }

  log.step(`Usando API: ${apiUrl}`);

  // Obtener credenciales y hacer login
  const email = process.env.DEMO_EMAIL;
  const password = process.env.DEMO_PASSWORD;

  if (!email || !password) {
    log.error('DEMO_EMAIL y DEMO_PASSWORD no encontrados en .env.development');
    log.info(
      'Por favor, agrega DEMO_EMAIL y DEMO_PASSWORD a tu archivo .env.development',
    );
    process.exit(1);
  }

  log.step(`Email: ${email}`);

  // Hacer login automáticamente
  let token: string;
  try {
    token = await login(apiUrl, email, password);
  } catch (error: any) {
    log.error(`Error al hacer login: ${error.message}`);
    process.exit(1);
  }

  // Crear todas las mascotas de demo automáticamente
  log.title(`🚀 Creando ${DEMO_PETS.length} Mascotas de Demo...`);

  const results = [];
  for (let i = 0; i < DEMO_PETS.length; i++) {
    const petData = DEMO_PETS[i];

    log.title(`📝 Mascota ${i + 1}/${DEMO_PETS.length}: ${petData.name}`);
    log.step(`Nombre: ${petData.name}`);
    log.step(`Especie: ${petData.species}`);
    if (petData.breed) log.step(`Raza: ${petData.breed}`);
    if (petData.birth_date)
      log.step(`Fecha de nacimiento: ${petData.birth_date}`);
    if (petData.weight_kg) log.step(`Peso: ${petData.weight_kg} kg`);
    if (petData.sex) log.step(`Sexo: ${petData.sex}`);

    try {
      const result = await createPet(apiUrl, token, petData);
      log.success(`✓ ${petData.name} creado exitosamente`);
      const petId = result.id || result.pet_id;
      log.info(`   ID: ${petId}`);
      results.push({ ...petData, id: petId });

      // Crear registros de salud para esta mascota
      // Distribución: 2 saludables, 2 atención requerida, 1 revisión necesaria (Mariana)
      // Mariana (iguana) siempre será "Revisión Necesaria" (sin registros)
      const isHealthy = i % 2 === 0 && petData.name !== 'Mariana'; // Alterna, excepto Mariana
      await createHealthRecords(
        apiUrl,
        token,
        petId,
        petData.name,
        petData.species,
        isHealthy,
      );

      // Pausa entre mascotas para evitar rate limiting
      if (i < DEMO_PETS.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error: any) {
      log.error(`✗ Error al crear ${petData.name}: ${error.message}`);
    }
  }

  // Resumen final
  log.title('✅ Resumen de Mascotas Creadas');
  results.forEach((pet, index) => {
    log.success(`${index + 1}. ${pet.name} (${pet.species}) - ID: ${pet.id}`);
  });

  if (results.length === DEMO_PETS.length) {
    log.success(
      `\n🎉 ¡Todas las ${results.length} mascotas fueron creadas exitosamente!`,
    );
  } else {
    log.info(
      `\n⚠️  Se crearon ${results.length} de ${DEMO_PETS.length} mascotas`,
    );
  }

  // Calcular y mostrar tiempo total
  const endTime = Date.now();
  const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
  log.title(`⏱️  Tiempo total del proceso: ${totalSeconds} segundos`);

  process.exit(0);
}

// Ejecutar
main().catch((error) => {
  log.error(`Error inesperado: ${error.message}`);
  process.exit(1);
});
