function movilidad(tipo, ciclo, pais, ciudad) {
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
