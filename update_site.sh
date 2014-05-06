#!/bin/sh

read -p "Continue (y/n)?" choice
case "$choice" in 
  y|Y ) git subtree push --prefix _site origin master ;;
  n|N ) echo "That was close ...";;
  * ) echo "invalid";;
esac

