npm config set registry https://www.myget.org/F/ngrx-message-bus/npm/

npm adduser --registry=https://www.myget.org/F/ngrx-message-bus/npm/

cd /d "D:\Programming\ngx\ngx-workspace"

npm run build:lib

copy README.md "D:\Programming\ngx\ngx-workspace\projects\ngrx-message-bus\dist"

cd /d "D:\Programming\ngx\ngx-workspace\projects\ngrx-message-bus\dist"

npm publish --registry=https://www.myget.org/F/ngrx-message-bus/npm/