#!/bin/sh

echo "CJS":
cat <<!EOF
{
    "type": "commonjs"
}
!EOF

echo "Module:"
cat <<!EOF
{
    "type": "module"
}
!EOF
