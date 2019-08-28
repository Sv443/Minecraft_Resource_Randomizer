const settings = {
    info: {
        name: "Minecraft Resource Randomizer",
        desc: "Creates a Minecraft resource pack with randomized textures and sounds",
        abbr: "MRR",
        version: [0, 1, 0],
    },
    defaultPacks: { // thanks to the German YouTuber Pezcraft (https://www.youtube.com/channel/UCEgQQlikpCYhtwD10muIz0Q) for offering the following default resource packs on his website (https://tutorialpack.jimdo.com/)
        "1.8": {
            url: "https://download1593.mediafire.com/euw8v8yvnvgg/xd0hnmslo25nvxd/1.8+Template.zip",
            key: "1",
        },
        "1.9": {
            url: "https://download1080.mediafire.com/d4f1pjp6cnyg/f7a433f26u2u2f4/1.9+Template.zip",
            key: "2",
        },
        "1.10": {
            url: "https://download1581.mediafire.com/6yjnny52cnbg/12g7lkb201h6kdh/1.10+Template.zip",
            key: "3",
        },
        "1.11": {
            url: "https://download1475.mediafire.com/s72iyx6rtwig/te3g2cis6z2dava/1.11+Template.zip",
            key: "4",
        },
        "1.12": {
            url: "https://download1481.mediafire.com/ww6wk59zr6hg/4g4ciu24cgd20ar/1.12+Template.zip",
            key: "5",
        },
        "1.13": {
            url: "https://download1511.mediafire.com/fp2wkrzh77ag/z1prx283maflm6z/1.13+Template.zip",
            key: "6",
        },
        "1.14": {
            url: "https://download1517.mediafire.com/906pzqy301fg/4to38xli3iizfv0/1.14+Template.zip",
            key: "7",
        },
    },
    listAllFiles: {
        verboseLogging: false,
    },
    seed: {
        digitCount: 10,
        numberCount: 50,
    },
}

module.exports = settings;