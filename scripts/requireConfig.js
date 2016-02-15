requirejs.config({
	baseUrl: "scripts",
	paths: {
		/* Libraries */
		"domReady":        "lib/domReady",
		"jquery":          "lib/jquery",
		"jquery-ui":       "lib/jquery-ui",
		"Chart":           "lib/Chart",
		"moment":          "lib/moment",

		/* Core */
		"helperMethods":   "core/helperMethods",
		"stringReplacer":  "core/stringReplacer",
		"async":           "core/async",
		"ChangeLogger":    "core/changeLogger",
		"colorEffects":    "core/colorEffects",
		"Storage":         "core/storage",
		"_Popup":          "core/Popup",
		"_OptionMenu":     "core/OptionMenu",

		/* Data */
		"changeTypes":     "data/changeInfo",
		"batchTypes":      "data/changeInfo",
		"objectTypes":     "data/changeInfo",
		"textResources":   "data/textResources",
		"copier":          "data/copier",
		
		/* Data Classes */
		"Rhymer":          "data/rhymer",
		
		/* UI */
		"settingsMenu":    "ui/settingsMenu",
		"classes":         "ui/classes",
		"printer":         "ui/printer",
	},
	config: {
		moment: {
			noGlobal: true
        }
	}
});