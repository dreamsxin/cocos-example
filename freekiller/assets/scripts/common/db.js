
window.db = {
	freeEnermyGeneratorRules: [
		{ //0
			type: "SequenceGenner",
			config: [
				{
					type: "NormalEnermyGenner",
					config: {
						names: ['en3'],
						bloodAddRange: [0, 100],
						speedAddRange: [0, 0],
						totalCount: 2,
					},
				},
			],
			
		},
		{ //1
			type: "SequenceGenner",
			config: [
				{
					type: "NormalEnermyGenner",
					config: {
						names: ['en4'],
						bloodAddRange: [0, 100],
						speedAddRange: [0, 0],
						totalCount: 2,
					},
				},
				{
					type: "WaitZeroEnermy",
				},
				{
					type: "NormalEnermyGenner",
					config: {
						names: ['en4'],
						bloodAddRange: [0, 100],
						speedAddRange: [0, 0],
						totalCount: 2,
					},
				},
			],
		},
		{ //2
			type: "SequenceGenner",
			config: [
				{
					type: "NormalEnermyGenner",
					config: {
						names: ['en33'],
						bloodAddRange: [0, 100],
						speedAddRange: [0, 0],
						totalCount: 2,
					},
				},
				{
					type: "WaitSecond",
					config: {
						second: 2
					}
				},
				{
					type: "NormalEnermyGenner",
					config: {
						names: ['en44'],
						bloodAddRange: [0, 100],
						speedAddRange: [0, 0],
						totalCount: 2,
					},
				},
				{
					type: "WaitSecond",
					config: {
						second: 2
					}
				},
				{
					type: "NormalEnermyGenner",
					config: {
						names: ['en33'],
						bloodAddRange: [0, 100],
						speedAddRange: [0, 0],
						totalCount: 2,
					},
				},
				{
					type: "WaitSecond",
					config: {
						second: 2
					}
				},
				{
					type: "NormalEnermyGenner",
					config: {
						names: ['en44'],
						bloodAddRange: [0, 100],
						speedAddRange: [0, 0],
						totalCount: 2,
					},
				},
			],
		},
	],

	freeEnermyGeneratorDefaultRule: {
		type: "SequenceGenner",
		config: [
			{
				type: "NormalEnermyGenner",
				config: {
					names: ['en33'],
					bloodAddRange: [0, 100],
					speedAddRange: [0, 0],
				},
				totalCount: 2,
			},
			{
				type: "WaitSecond",
				config: {
					second: 2
				}
			},
			{
				type: "NormalEnermyGenner",
				config: {
					names: ['en44'],
					bloodAddRange: [0, 100],
					speedAddRange: [0, 0],
				},
				totalCount: 2,
			},
			{
				type: "WaitSecond",
				config: {
					second: 2
				}
			},
			{
				type: "NormalEnermyGenner",
				config: {
					names: ['en33'],
					bloodAddRange: [0, 100],
					speedAddRange: [0, 0],
				},
				totalCount: 2,
			},
			{
				type: "WaitSecond",
				config: {
					second: 2
				}
			},
			{
				type: "NormalEnermyGenner",
				config: {
					names: ['en44'],
					bloodAddRange: [0, 100],
					speedAddRange: [0, 0],
				},
				totalCount: 2,
			},
			// {
			// 	type: "CampGenner",
			// 	config: {
			// 		names: ['camp'],
			// 		bloodAddRange: [0, 100],
			// 		speedAddRange: [0, 0],
			// 	},
			// 	totalCount: 2,
			// },
		],
	},

	enermies: {
	    en3: {
	        name: "?????????",
	        baseblood: 100,
	        speed: 10
	    },
	    en4: {
	        name: "?????????",
	        baseblood: 200,
	        speed: 6
	    },
	    en33: {
	        name: "????????????",
	        baseblood: 300,
	        speed: 2
	    },
	    en44: {
	        name: "????????????",
	        baseblood: 500,
	        speed: 2
	    },
	    camp: {
	        name: "??????",
	        baseblood: 1000,
	    }
	}
}