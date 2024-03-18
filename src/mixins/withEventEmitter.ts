export default (serviceName, handlersName) => ({
	created() {
		for (const eventName in this[handlersName]) {
			this[serviceName].on(eventName, this[handlersName][eventName])
		}
	},
	beforeDestroy() {
		for (const eventName in this[handlersName]) {
			this[serviceName].removeListener(eventName, this[handlersName][eventName])
		}
	},
})
