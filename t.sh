echo "设置 npm config set registry https://registry.npmjs.org"

npm config set registry https://registry.npmjs.org

echo "打包 => dist";

# 打包 => dist
npm run build;

echo "打包 插件build";

# 打包 插件
npm run build;

echo "推送到npmjs";

#推送到npmjs
npm publish;

echo "设置 npm config set registry https://registry.npm.taobao.org"

npm config set registry https://registry.npm.taobao.org