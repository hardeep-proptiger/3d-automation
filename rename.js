var fs = require('fs');

var arr = ["living room2.jpg", "living room3.jpg", "living room4.jpg", "living room1.jpg", "living room5.jpg", "living room7.jpg", "kitchen2.jpg", "kitchen1.jpg", "br1.4.jpg", "br1.5.jpg", "br1.3.jpg", "br1.2.jpg", "br1.1.jpg", "bathroom1.jpg", "br2.1.jpg", "br2.2.jpg", "br2.3.jpg"];

arr.forEach( function( url, ind ){
    fs.renameSync('public/projects/proptiger/highres/'+url, 'public/projects/proptiger/highres/'+ind+'.jpg', function (err) {
        if (err) throw err;
        console.log('renamed complete');
    });
});

arr.forEach( function( url, ind ){
    fs.renameSync('public/projects/proptiger/lowrez/'+url, 'public/projects/proptiger/lowrez/'+ind+'.jpg', function (err) {
        if (err) throw err;
        console.log('renamed complete');
    });
});

arr.forEach( function( url, ind ){
    fs.renameSync('public/projects/proptiger/midrez/'+url, 'public/projects/proptiger/midrez/'+ind+'.jpg', function (err) {
        if (err) throw err;
        console.log('renamed complete');
    });
});