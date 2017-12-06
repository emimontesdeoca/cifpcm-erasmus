/** Clase movilidad. */
class movilidad {
  /**
   * Create una movilidad
   * @param {string} tipo Tipo de movilidad
   * @param {string} ciclo ciclo de movilidad
   * @param {string} pais Pais de la movilidad
   * @param {string} ciudad Ciudad de la movilidad
   */
  constructor(tipo, ciclo, pais, ciudad) {
    /// ID necesario para realizar cambios
    this.id =
      Math.random()
        .toString(36)
        .substring(7) || "a3k9ka";
    /// Tipo
    this.tipo = tipo || "tipo";
    /// ciclo
    this.ciclo = ciclo || "ciclo_" + this.id;
    /// pais
    this.pais = pais || "Uruguay";
    /// ciudad
    this.ciudad = ciudad || "Punta del Este";
  }
  /**
   * Modificar el objeto movilidad
   * @param {string} tipo Tipo de movilidad
   * @param {string} ciclo ciclo de movilidad
   * @param {string} pais Pais de la movilidad
   * @param {string} ciudad Ciudad de la movilidad
   *
   */
  modificar(tipo, ciclo, pais, ciudad) {
    /// Tipo
    this.tipo = tipo;
    /// ciclo
    this.ciclo = ciclo;
    /// pais
    this.pais = pais;
    /// ciudad
    this.ciudad = ciudad;
  }
}
