#!/bin/bash

echo '' > mocha.log
counter=1
while [ $counter -le 20 ]
do
mocha >> mocha.log &
((counter++))
done