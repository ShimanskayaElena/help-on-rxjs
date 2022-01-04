// альтернативный способ представления мраморной диаграммы с помощью ASCII символов:
// ---^---a---b--c---d--X--|-->
// a,b,c,d - генерируемые значения
// X - ошибка
// | - сигнал завершения
// ---> - временная ось
// ^ - подписка на поток


// import {fullObserver, stream} from "./utils";
// import {interval} from "rxjs/observable/interval";
// import {merge} from "rxjs/observable/merge";
// import {concat} from "rxjs/observable/concat";
// import { race } from 'rxjs/observable/race';
// import {map, mergeAll, concatAll, switchAll, take} from "rxjs/operators";
// import {combineLatest} from "rxjs/observable/combineLatest";
// import {zip} from "rxjs/observable/zip";
// import { forkJoin } from 'rxjs/observable/forkJoin';
// import {withLatestFrom} from "rxjs/operators";

// --------------------------------------------------------------------
const input = document.querySelector('input');
const span = document.querySelector('span');
const eventsArray = [];
input.addEventListener('keyup', (event) => {
    // eventsArray.push(event.target.value);
    eventsArray.push(event.key);
    span.innerHTML = eventsArray.toString();
});
// -----------------------------------------------------------------------
// Графическое представление потока:  --^-- Hello -- World! --|-->

// const observable = rxjs.Observable.create( (observer) => {
//     observer.next('Hello');
//     observer.next('World!');
//     observer.complete();
// });
// const observer = {
//     next: value => console.log('first stream - ', value),
//     error: error => console.error('first stream - ', error),
//     complete: () => console.log('first stream - completed')
// };

// first stream
// observable.subscribe(observer);

// second stream
// observable.subscribe(
//     value => console.log('second stream - ', value),
//     error => console.error('second stream - ', error),
//     () => console.log("second stream - completed")
// );

// third stream
// observable.subscribe(
//     value => console.log('third stream - ', value)
// );

// ------- Отписка от прослушивания потока -------------------------------------
// --^-- 0 -- 1 -- 2 -- 3 -- 4 --|-->

// const timer = rxjs.Observable.create((observer) => {
//     let counter = 0;
//     setInterval(() => {
//         observer.next(counter++);
//     }, 1000);
// });
// const subscription = timer.subscribe(value => console.log(value));
// setTimeout(() => {
//     subscription.unsubscribe();
// }, 5000);

// ----------------- методы для создания потоков --------------------------------------------
// -------- create ------------------------------
// Rx.Observable.create() создает пользовательский поток данных,
// информируя каждого подписчика о событиях (next()) или ошибках (error())

// -------- interval ---------------------------
// возвращает Observable, который выдает порядковый номер в указанном временном интервале
// ----- A ---- B ---- C ---- D ----|---->

const A = rxjs.interval(1000).pipe(
    rxjs.operators.take(4),
    rxjs.operators.map(index => {
        const arr = ['A', 'B', 'C', 'D', 'E', 'F'];
        return arr[index];
    }),
    // rxjs.operators.tap(value => console.log(value))
);
// a.subscribe();
// -- 0 -- 1 -- 2 -- 3 -- 4 -- 5 -- 6 -- 7 -- 8 -- 9 --|-->
const b = rxjs.interval(200).pipe(
    rxjs.operators.take(10),
    // rxjs.operators.tap(value => console.log(value))
);
// b.subscribe();

// pipe() - это конвейерный оператор. Он позволит создавать лучшие решения с более читаемым кодом и зачастую с меньшим количеством кода.

// -------- of --------------------------------------
// принимает на вход любое количество аргументов и возвращает готовый экземпляр Observable.
// После подписки он испустит полученные значения и завершится.
// -- RxJS --|-->
// const observable = rxjs.of('RxJS');

// -- [1, 2, 3] --|-->
// const observable = rxjs.of([1, 2, 3]);

// -- 1 -- 2 -- 3 --|-->
// const observable = rxjs.of(1, 2, 3);

// observable.subscribe(value => console.log(value));

// -------- from ------------------------------
//  в качестве аргумента ожидает любой итерируемый объект(массив, строка и т.д.) или promise,
//  и проецирует этот объект на поток

// -- R -- x -- J -- S --|-->
// const observable = rxjs.from('RxJS');

// -- 1 -- 2 -- 3 --|-->
// const observable = rxjs.from([1, 2, 3]);

// const promise = new Promise((resolve, reject) => {
//     resolve(1);
// });
// const observable = rxjs.from(promise);

// observable.subscribe(value => console.log(value));

// ------- fromEvent ----------------------------------------------------------------
// позволяет создать поток из событий DOM элементов
// const observable = rxjs.fromEvent(input, 'keyup');
// observable.subscribe(value => console.log(value.target.value));

// ------- map --------------------------------------------------------------------
// преобразовывает  значение и передаёт его дальше в поток
// возвращает новый поток, основанный на родительском. Функция не модифицируют родительский поток.
// at the entrance: -- 0 -- 1 -- 2 -- 3 -- 4 -- 5 -- 6 -- 7 -- 8 -- 9 --|-->
// at the exit: -- 0 -- 2 -- 4 -- 6 -- 8 -- 10 -- 12 -- 14 -- 16 -- 18 --|-->
// b.pipe(
//     rxjs.operators.map(value => value * 2)
// ).subscribe(value => console.log(value));

// ------- filter ----------------------------------------------------------------
// если значение из потока удовлетворяет условию, то оно пропускается дальше
// at the entrance: -- 0 -- 1 -- 2 -- 3 -- 4 -- 5 -- 6 -- 7 -- 8 -- 9 --|-->
// at the exit: -- 1 -- 3 -- 5 -- 7 -- 9 --|-->
// b.pipe(
//     // пропускаем только нечетные значения
//     rxjs.operators.filter(value => value % 2 !== 0)
// ).subscribe(value => console.log(value));

// ------- reduce ---------------------------------------------------------------
// Применяет функцию накопителя к исходному Observable и возвращает накопленный результат,
// когда источник завершается, учитывая необязательное начальное значение.
// Объединяет вместе все значения, переданные в источнике, используя функцию аккумулятора,
// которая знает, как присоединить новое значение источника к накоплению из прошлого.
// at the entrance: -- 0 -- 1 -- 2 -- 3 -- 4 -- 5 -- 6 -- 7 -- 8 -- 9 --|-->
// at the exit: -- 45 --|-->
// b.pipe(rxjs.operators.reduce((ass, curr) => ass + curr, 0)).subscribe(value => console.log(value));

// ------- scan --------------------------------------------------------------------
// Полезно для инкапсуляции и управления состоянием.
// Применяет аккумулятор (или «функцию редуктора») к каждому значению из источника после того,
// как начальное состояние установлено - либо через второй аргумент,
// либо из первого значения из источника.
// Это как reduce, но выдает текущее состояние накопления после каждого обновления,
// например, сумму с течением времени
// at the entrance: -- 0 -- 1 -- 2 -- 3 -- 4  -- 5  -- 6  -- 7  -- 8  -- 9  --|-->
// at the exit:     -- 0 -- 1 -- 3 -- 6 -- 10 -- 15 -- 21 -- 28 -- 36 -- 45 --|-->
// b.pipe(rxjs.operators.scan((ass, curr) => ass + curr, 0)).subscribe(value => console.log(value));
// RxJS v6+
// b.pipe(rxjs.operators.scan((ass, curr) => [...ass, curr], [])).subscribe(value => console.log(value));

// ------- buffer ------------------------------------------------------------
// собираем клики в списки
// Буферизует исходные наблюдаемые значения до тех пор, пока не сработает Observable,
// который сигнализирует о том, что буфер будет выдан на выходе в новый Observable.

// const button = document.querySelector('button');
// const myInterval = rxjs.interval(1000).pipe(rxjs.operators.take(21));
// const bufferBy = rxjs.fromEvent(button, 'click');
// const myBufferedInterval = myInterval.pipe(rxjs.operators.buffer(bufferBy));
// myBufferedInterval.subscribe(val => console.log(' Buffered Values:', val));

// ------ merge ---------------------------------------------------------
// объединяет несколько наблюдаемых потоков и одновременно генерирует все значения из каждого входного потока.
// Когда создаются значения из любой комбинированной последовательности,
// эти значения выводятся как часть результирующей последовательности.
// Такой процесс часто упоминается как выравнивание в документации.
// Соединяет события этих двух потоков в один
// -- 0 -- 1 -- 2 -- 3 -- 4 -- A -- 5 -- 6 -- 7 -- 8 -- B -- 9 -- C -- D --|-->
// rxjs.merge(A, b).subscribe(x => console.log(x));

// ------ concat, concatWith ---------------------------------------------------------
// Испускает все значения из наблюдаемого источника,
// а затем после его завершения подписывается на каждый последующий предоставленный наблюдаемый источник по одному,
// выдавая все их значения и не подписываясь на следующий, пока предыдущий не завершится.

// concat - в RxJS 6 существует только как статическая функция.
// ---- A ---- B ---- C ---- D - 0 - 1 - 2 - 3 - 4 - 5 - 6 - 7 - 8 - 9 --|-->
// rxjs.concat(A, b).subscribe(x => console.log(x)); // до 8 версии

// конвейерный оператор
// ---- A ---- B ---- C ---- D - 0 - 1 - 2 - 3 - 4 - 5 - 6 - 7 - 8 - 9 ---- A ---- B ---- C ---- D --|-->
// A.pipe(
//     rxjs.operators.concatWith(b, A)
// ).subscribe(x => console.log(x));

// ------- race, raceWith ---------------------------------------------------------
// race используется для выбора наблюдаемых последовательностей, которые первыми получают значения.
// Как только одна из последовательностей начинает выдавать значения,
// другие последовательности отписываются и полностью игнорируются.
// at the exit:  -- 0 -- 1 -- 2 -- 3 -- 4 -- 5 -- 6 -- 7 -- 8 -- 9 --|-->

// race - в RxJS 6 существует только как статическая функция.
// rxjs.race(A, b).subscribe(x => console.log(x));

// конвейерный оператор
// A.pipe(rxjs.operators.raceWith(b)).subscribe(x => console.log(x));

// -------- startWith, endWith ------------------------------------------------
// Это полезный способ узнать, произошла ли подписка на существующий наблюдаемый объект.
// возвращает Observable, который синхронно испускает предоставленные значения перед подпиской на исходный Observable.
// at the exit: -- Start: -- 0 -- 1 -- 2 -- 3 -- 4 -- 5 -- 6 -- 7 -- 8 -- 9 -- End! --|-->
// b.pipe(
//     rxjs.operators.endWith('End!'),
//     rxjs.operators.startWith('Start:')
// ).subscribe(value => console.log(value));

// -------- debounceTime ------------------------------------------------
// в качестве первого аргумента принимает число миллисекунд, в течение которых значение будет удерживаться,
// прежде чем пройдет дальше. При этом каждое новое значение будет сбрасывать таймер. Таким образом,
// на выходе мы получим последнее значение, после ввода которого прошло заданное количество миллисекунд.
// Это похоже delay, но передает только самое последнее значение из тех, что поступили в поток.
// at the exit: -- 9 --|-->

// const c = rxjs.interval(200).pipe(
//     rxjs.operators.take(10),
//     rxjs.operators.debounceTime(200),
//     rxjs.operators.tap(value => console.log(value))
// );
// c.subscribe();

// ------- distinctUntilChanged -----------------------------------------
// избавит от дублирующих эначений
// at the exit:  -- a -- b -- c -- b -- a --|-->

// const observable = rxjs.of('a', 'a', 'b', 'b', 'c', 'c', 'b', 'a').pipe(rxjs.operators.distinctUntilChanged());
// observable.subscribe(value => console.log(value));

// -------- timer -----------------------------------------------------------------------
// Метод timer очень похож по принципу работы на interval. Но в отличие от него позволяет задать таймаут запуска потока,
// который передается первым параметром. Вторым параметром указывается интервал, через который будет генерироваться
// новое значение. Если второй параметр не указывать, то таймер сгенерирует только одно значение и завершит поток.
// Используется для отправки уведомления после задержки (для создания задержек в коде или гонок с другими значениями
// для временных тайм-аутов). Воэвращает число 0.

// rxjs.timer(2000).pipe( // -- 0 --|-->
//     rxjs.operators.mapTo('success') // -- success --|-->
// ).subscribe(x => console.log(x));

// --------- : pairwise -------------------------------
// Вывести предыдущее и текущее значения в виде массива.
// -- [0 ,1] -- [1, 2] -- [2, 3] -- [3, 4] -- [4, 5] --|-->

// rxjs.interval(200).pipe(
//     rxjs.operators.pairwise(),
//     rxjs.operators.take(5)
// ).subscribe(value => console.log(value));

// --------- Операторы более высокого порядка ----------------------------------------

// rxjs.timer(0, 1000).pipe( // -- 0 --|-->    -- 0 --|-->   -- 0 --|-->   -- 0 --|-->
//     rxjs.operators.map( _ => {
//         return rxjs.timer(1000).pipe(
//             rxjs.operators.mapTo('success') // -- success --|-->
//         );
//     })
// ).subscribe(observable$ => {
//     observable$.subscribe(value => console.log(value));
// });

// rxjs.timer(0, 1000).pipe( // внешний поток
//     rxjs.operators.map( _ => {
//         return rxjs.timer(1000).pipe( // внутренний поток
//             rxjs.operators.mapTo('success')
//         );
//     }),
//     rxjs.operators.mergeAll()
// ).subscribe(value => console.log(value));

// rxjs.timer(0, 1000).pipe( // внешний поток
//     rxjs.operators.mergeMap( _ => {
//         return rxjs.timer(1000).pipe( // внутренний поток
//             rxjs.operators.mapTo('success')
//         );
//     })
// ).subscribe(value => console.log(value));

// ------- mergeAll ------------------------------------------------------
// если сетевой вызов для некоторого ресурса может привести к ряду других запросов, определяемых результирующим
// значением исходного запроса, то  оператор mergeAll объединяет все испускаемые внутренние потоки и так же,
// как и обычный merge, одновременно выдает значения из каждого потока.
// at the exit: -- A -- 0 -- 1 -- 2 -- 3 -- 4 -- B -- 5 -- 6 -- 7 -- 8 -- 9 -- C -- D --|-->

// rxjs.interval(1000).pipe(
//     rxjs.operators.take(2),
//     rxjs.operators.map(i => [A, b][i]),
//     rxjs.operators.mergeAll()
// ).subscribe(x => console.log(x));

// ------- mergeMap -------------------------------------------------------
// можно заменить map и mergeAll на mergeMap, который сам подписывается на поток
// Каждую секунду у нас создается новый внутренний поток и mergeMap на него подписывается.
// Таким образом, у нас одновременно работают множество внутренних потоков, значения из которых попадают во внешний
// at the exit: -- A -- 0 -- 1 -- 2 -- 3 -- 4 -- B -- 5 -- 6 -- 7 -- 8 -- 9 -- C -- D --|-->

// rxjs.interval(1000).pipe(
//     rxjs.operators.take(2),
//     rxjs.operators.mergeMap(i => [A, b][i])
// ).subscribe(x => console.log(x));

// ------- concatAll -----------------------------------------------------
// объединяет все испускаемые внутренние потоки и последовательно выдает значения из каждого потока.
// at the exit: ----- A ---- B ---- C ---- D -- 0 -- 1 -- 2 -- 3 -- 4 -- 5 -- 6 -- 7 -- 8 -- 9 --|-->
// rxjs.interval(1000).pipe(
//     rxjs.operators.take(2),
//     rxjs.operators.map(i => [A, b, A][i]),
//     rxjs.operators.concatAll()
// ).subscribe(x => console.log(x));

// ------- concatMap ----------------------------------------------------
// подписавшись на внутренний поток, ждет, пока тот не завершится, и только потом подписывается на следующий.
// at the exit: -- 0 -- 1 -- 2 -- 3 -- 4 -- 5 -- 6 -- 7 -- 8 -- 9 ----- A ---- B ---- C ---- D --|-->

// rxjs.interval(1000).pipe(
//     rxjs.operators.take(2),
//     rxjs.operators.concatMap(i => [b, A][i])
// ).subscribe(x => console.log(x));

// ------- switchAll -----------------------------------------------------
// подписывается и выдает значения только из самой последней внутренней последовательности, игнорируя предыдущие потоки
// at the exit: -- 0 -- 1 -- 2 -- 3 -- 4 -- 5 -- 6 -- 7 -- 8 -- 9 --|-->

// rxjs.interval(100).pipe(
//     rxjs.operators.take(2),
//     rxjs.operators.map(i => [A, b][i]),
//     rxjs.operators.switchAll()
// ).subscribe(x => console.log(x));

// ------- switchMap ---------------------------------------------------
// После того, как излучается первая наблюдаемая, она подписывается на внутреннюю наблюдаемую
// Он отменит предыдущий запрос, если новый будет сделан до того, как текущий будет завершен.
// Это означает, что мы всегда получаем результат того запроса, который был сделан последним.

// rxjs.interval(100).pipe(
//     rxjs.operators.take(2),
//     rxjs.operators.switchMap(i => [A, b][i])
// ).subscribe(x => console.log(x));

// ------ exhaust -----------------------------------------------------
// подписавшись на поток, ждет, когда он завершится. Если к нему спускается новый поток, то он просто отбрасывается.
// at the exit: ---- A ---- B ---- C ---- D --|-->

// rxjs.interval(100).pipe(
//     rxjs.operators.take(2),
//     rxjs.operators.map(i => [A, b][i]),
//     rxjs.operators.exhaust()
// ).subscribe(x => console.log(x));

// ------ exhaustMap --------------------------------------------------------
// at the exit: ---- A ---- B ---- C ---- D --|-->

// rxjs.interval(100).pipe(
//     rxjs.operators.take(2),
//     rxjs.operators.exhaustMap(i => [A, b][i])
// ).subscribe(x => console.log(x));

// ------- forkJoin -------------------------------------------------
// существует только как статическая функция!
// Результирующий поток испускает только один раз, когда все внутренние потоки завершены.
// Например, вы можете сделать несколько сетевых запросов и выполнять действие только после получения ответа на все из них.
// at the exit: ---- [ 'D', 9 ] --|-->

// rxjs.forkJoin(A, b).subscribe(x => console.log(x));
// rxjs.forkJoin([A, b]).subscribe(x => console.log(x));  // Новый тип аргументов

// // at the exit: ---- { first: 'D', second: 9 } --|-->
const dictionary = {
    first: A,
    second: b
};
// rxjs.forkJoin(dictionary).subscribe(x => console.log(x)); // Новый тип аргументов

// ------ combineLatest, combineLatestWith -----------------------------------------------
// Простым примером будет система мониторинга, которая принимает два потока A и b в качестве входных данных и,
// когда один из потоков генерирует значение, возвращает два наиболее свежих значения из A и b.
// Но если один из источников еще не сгенерировал ни одного значения, combineLatest() не произведет события в поток вывода!!!

// combineLatest - в RxJS 6 существует только как статическая функция.
// rxjs.combineLatest(A, b).subscribe(x => console.log(x));
// rxjs.combineLatest([A, b]).subscribe(x => console.log(x)); // Новый тип аргументов

// конвейерный оператор!
// A.pipe(rxjs.combineLatestWith(b)).subscribe(x => console.log(x));
// b.pipe(rxjs.combineLatestWith(A)).subscribe(x => console.log(x));

// rxjs.combineLatest(dictionary).subscribe(x => console.log(x)); // Новый тип аргументов
// ------- zip, zipWith, zipAll --------------------------------------------------------
// объединяет две или более последовательности соответствующих значений в виде кортежа (пары в случае двух входных потоков).
// Он ожидает получения соответствующего значения из всех входных потоков,
// затем преобразует их в одно значение с помощью функции проекции и выдает результат.
// at the exit: -- [A, 0] -- [B, 1] -- [C, 2] -- [D, 3] --|-->

// В RxJS 6 существует только как статическая функция.
// rxjs.zip(A, b).subscribe(x => console.log(x));
// rxjs.zip([A, b]).subscribe(x => console.log(x)); // Новый тип аргументов

// конвейерный оператор!
// A.pipe(rxjs.operators.zipWith(b)).subscribe(x => console.log(x));

// Собирает все наблюдаемые внутренние источники из внешнего источника,
// как только источник завершается, zipAll подписывается на все внутренние источники,
// объединяя их значения по индексу и испуская их.
// rxjs.of(A, b).pipe(rxjs.operators.zipAll()).subscribe(x => console.log(x));

// ------ withLatestFrom --------------------------------------------
// существует только как конвейерный оператор!
// используется, когда у вас есть один направляющий поток, но вам также нужны последние значения из других потоков.
// withLatestFrom испускает новое значение, только если есть новое излучение из направляющего потока.

// A - направляющий поток
// A.pipe(rxjs.operators.withLatestFrom(b)).subscribe(x => console.log(x));

// -------------------------------------------------------------------------------------
// все операторы, которые объединяют значения путем спаривания (combineLatest, zip, forkJoin,  withLatestFrom),
// принимают дополнительную функцию проекции. Эта функция определяет преобразование для результирующего значения.
// Используя эту функцию, можно выбрать выдачу значения из определенной входной последовательности
// или объединение значений любым способом.

// возвращаем значение из второй последовательности 
// rxjs.zip(A, b, (A, b) => b).subscribe(x => console.log(x));

// объединяем значения, используя тире в качестве 
// rxjs.zip(A, b, (A, b) => ` ${a} - ${b}`).subscribe(x => console.log(x));

// возвращаем один логический результат 
// rxjs.zip(A, b, (A, b) => b && a).subscribe(x => console.log(x));

// -------------------------------------------------------------------------------
