import axios from '@api/axios'

// Отправляет файл на загрузку через FormData
export default file => {
	const formData = new FormData()
	formData.append('file', file)

	return axios.post('upload', formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	})
}
