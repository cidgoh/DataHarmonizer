for d in */ ; do
    echo "$d"
    cd $d
    python ../../script/make_data.py
    cd -
done
