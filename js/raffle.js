window.onload = function () {
    var data = {
        stopped: 0,
        n: 0,
        numbers: [],
        candidates: []
    };

    var vm = null;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var config = xmlhttp.responseText.split('\n');
            data.n = parseInt(config[0]);
            data.stopped = data.n;
            for (var i = 0; i < data.n; ++i) {
                data.numbers.push(config[1]);
            }
            data.candidates = config.slice(1, config.length - 1);
            createViewModel();
        }
    };
    xmlhttp.open('GET', 'config.txt', true);
    xmlhttp.send();

    function createViewModel() {
        vm = new Vue({
            el: '#main-container',
            data: data,
            ready: function () {
                this.$el.style.display = 'flex';
            },
            methods: {
                'switch': function () {
                    console.log(vm.stopped);
                    if (this.stopped == this.n) {
                        this.stopped = 0;
                    } else {
                        pickone();
                        this.stopped += 1;
                    }
                }
            }
        });

        function pickone() {
            var k = Math.floor(Math.random() * vm.candidates.length);
            var flag = true;
            while (flag) {
                flag = false;
                for (var i = 0; i < vm.stopped; ++i) {
                    if (vm.numbers[i] == vm.candidates[k]) {
                        k = Math.floor(Math.random() * vm.candidates.length);
                        flag = true;
                        break;
                    }
                }
            }
            vm.numbers.$set(vm.stopped, vm.candidates[k]);
        }

        function shuffle() {
            for (var i = vm.stopped; i < vm.n; ++i) {
                vm.numbers.$set(i, vm.candidates[Math.floor(Math.random() * vm.candidates.length)]);
            }
        }

        requestAnimationFrame(function animate() {
            shuffle();
            requestAnimationFrame(animate);
        });

        window.vm = vm;
    }
};
