#!/bin/sh

# https://github.com/microsoft/TypeScript/issues/18442#issuecomment-1369110873

[ -f dist/cjs/package.json ] || cat > dist/cjs/package.json <<!EOF
{
    "type": "commonjs"
}
!EOF

[ -f dist/esm/package.json ] || cat > dist/esm/package.json <<!EOF
{
    "type": "module"
}
!EOF
