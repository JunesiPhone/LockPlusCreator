# echo "Deleting main.css"
# cd "`dirname "$0"`"
# rm ../../mobile/css/main.css
# rm ../../mobile/css/main.min.css
# rm ../../mobile/mobilemain.js

# echo "Creating file list of all sub css files"

# find ../../mobile/compiled/css -name '*.css' > cssfilelist.txt
#cat ../cssfilelist.txt


#reading files from cssfilelist.txt and merge to one css file main.css

rm ../../creator/css/iosmain.css
rm ../../creator/css/iosmain.min.css

while read line
do
cat $line >> ../../creator/css/iosmain.css
done < cssfilelist.txt