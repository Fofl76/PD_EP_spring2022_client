const objectToFormData = (object: object) => {
  const formData = new FormData()

  Object
    .keys(object)
    .forEach((key) => {
      if (object[key] instanceof File || object[key] instanceof Blob) {
        formData.append(key, object[key] as File | Blob)
      }
      else {
        formData.append(key, JSON.stringify(object[key]))
      }

    })

  return formData;
}

export default objectToFormData
