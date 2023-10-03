function EventAssign() {}

EventAssign.add = function(args = null) {
	if (args == null)
		return;

	const { eventType = "click", target = null, origin = document, callback = function() {} } = args;
	
	if (typeof callback !== "function") {
		EventAssign.list[callback.name] = {
			origin: origin,
			eventType: eventType,
			func: callback.func
		};
		
		origin.addEventListener(eventType, callback.func);
	} else if (target != null) {
		origin.addEventListener(eventType, () => event.target.matches(target) ? callback(event) : null);
	} else {
		origin.addEventListener(eventType, callback);
	}
}
EventAssign.remove = function(callbackName) {
	if (!Object.keys(EventAssign.list).includes(callbackName))
		return false;

	const target = EventAssign.list[callbackName];
	
	target.origin.removeEventListener(target.eventType, target.func);
	delete EventAssign.list[callbackName];
}
EventAssign.list = {
	clean: function({ family = null, alone = null, match = null } = {}) {
		const removeAll = (key, extraRestrictions = []) => {
			const avoidMethod = methodsAvoid.includes(key),
				avoidEvent = eventFamilysAvoid.find(event => event.includes(key.split("_")[0])) ? true : false;

			if (avoidMethod || avoidEvent || extraRestrictions.includes(true))
				return null;

			EventAssign.remove(key);

			return key;
		}

		let target = family == null ? (alone == null ? null : "alone") : "family",
			methodsAvoid = ["clean"],
			eventFamilysAvoid = [];

		switch (target) {
			case "family":
				if (match == null)
					return false;

				const checkMatch = (key) => (match) ? key.search(family) === -1 : key.search(family) !== -1;

				return Object.entries(this).map(([key, value]) => {removeAll(key, [ checkMatch(key) ]);}).filter(ele => ele);
			break;
			case "alone":
				if (!this.hasOwnProperty(alone))
					return false;

				EventAssign.remove(alone);

				return [alone];
			break;
			default:
				return Object.entries(this).map(([key, value]) => removeAll(key)).filter(ele => ele);
		}
	}
};

export default EventAssign;