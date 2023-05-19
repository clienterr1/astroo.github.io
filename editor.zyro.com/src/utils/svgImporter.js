export default {
    async getSvg(name, location, namePostfix) {
        const symbolName = namePostfix ? `${name}-${namePostfix}` : name;
        const path = name && location ? `${location}/${symbolName}.svg` :
            '/link.svg';
        const svgModules =
            import.meta.glob('@/assets/icons/**/*.svg', {
                as: 'raw',
            });
        const targetModule = await Object.entries(svgModules).find(([modulePath]) => modulePath.endsWith(path))[1]();

        return targetModule.replace(/(<|<\/)symbol(>|)/gi, '$1svg$2');
    },
};