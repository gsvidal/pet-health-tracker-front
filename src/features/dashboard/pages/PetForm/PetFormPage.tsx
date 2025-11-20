import './PetFormPage.scss';
import { useState } from "react";
import { Heart, Upload, X } from "lucide-react";
import { Formpet } from '../../../../services/pet.service';
import { useNavigate } from "react-router-dom";

export function CreatePetForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    sex: "",
    birth_date: "",
    age: "",
    weight: "",
    photo: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      species: form.species,
      breed: form.breed,
      birth_date: form.birth_date,
      age_years: Number(form.age),
      weight_kg: Number(form.weight),
      sex: form.sex,
      photo_url: form.photo,
      notes: form.notes,
    };

    try {
      await Formpet(payload);
      navigate("/dashboard"); // Redirección al Dashboard
    } catch (error) {
      console.error("Error al crear mascota:", error);
    }
  };

  return (
    <div className="create-pet-container">
      <div className="create-pet-card">

        {/* Header */}
        <div className="card-header">
          <div className="header-icon">
            <Heart fill="white" size={24} />
          </div>
          <div>
            <h2>Crear Nueva Mascota</h2>
            <p>Completa la información de tu mascota para comenzar a gestionar su salud</p>
          </div>
        </div>

        {/* Información Básica */}
        <div className="section">
          <h3>Información Básica</h3>

          <div className="field">
            <label>Nombre de la Mascota <span className="required">*</span></label>
            <input
              type="text"
              name="name"
              placeholder="Ej: Max, Luna, Rocky..."
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Especie <span className="required">*</span></label>
              <select name="species" value={form.species} onChange={handleChange}>
                <option value="">Selecciona una especie</option>
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
                <option value="ave">Ave</option>
                <option value="conejo">Conejo</option>
                <option value="hamster">Hamster</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="field">
              <label>Raza <span className="required">*</span></label>
              <input
                type="text"
                name="breed"
                placeholder="Ej: Golden Retriever, Siamés..."
                value={form.breed}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <label>Sexo <span className="required">*</span></label>
            <select name="sex" value={form.sex} onChange={handleChange}>
              <option value="">Selecciona una opción</option>
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
            </select>
          </div>
        </div>

        {/* Detalles Físicos */}
        <div className="section">
          <h3>Detalles Físicos</h3>

          <div className="field-row">
            <div className="field">
              <label>Fecha de Nacimiento <span className="required">*</span></label>
              <input
                type="date"
                name="birth_date"
                value={form.birth_date}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Edad (años) <span className="required">*</span></label>
              <input
                type="text"
                name="age"
                placeholder="Ej: 3"
                value={form.age}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <label>Peso (kg) <span className="required">*</span></label>
            <input
              type="text"
              name="weight"
              placeholder="Ej: 28.5"
              value={form.weight}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Información Adicional */}
        <div className="section">
          <h3>Información Adicional</h3>

          <div className="field">
            <label>URL de Foto</label>
            <div className="input-group">
              <input
                type="text"
                name="photo"
                placeholder="https://ejemplo.com/foto-mascota.jpg"
                value={form.photo}
                onChange={handleChange}
              />
              <button type="button" className="icon-btn">
                <Upload size={16} />
              </button>
            </div>
          </div>

          <div className="field">
            <label>Notas</label>
            <textarea
              name="notes"
              placeholder="Información adicional sobre tu mascota"
              value={form.notes}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="actions">
          <button onClick={handleSubmit} className="btn-submit">
            <Heart size={18} fill="white" />
            Crear Mascota
          </button>
          <button className="btn-cancel">
            <X size={18} />
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}
