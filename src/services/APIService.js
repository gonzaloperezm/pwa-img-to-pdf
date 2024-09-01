
export default {
  async convertImagesToPDF(files) {
    const formData = new FormData();
    for (const file of files) {
      formData.append('images', file);
    }

    const response = await fetch('https://img-to-pdf-j9ul.onrender.com/api/images', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud: ' + response.statusText);
    }

    return await response.blob();
  },
};
