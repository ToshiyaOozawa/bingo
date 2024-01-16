'use strict';

{
  //BINGOシート生成

  function createColumn(col) {
    const bingoSource = [];
    for (let i = 0; i < 15; i++) {
      bingoSource.push(i + 1 + 15 * col);
      // bingoSource[i] = i + 1;
    }

    const column = [];
    for (let col = 0; col < 5; col++) {
      column.push(...bingoSource.splice(Math.floor(Math.random() * bingoSource.length), 1));
      // column[col] = bingoSource.splice(Math.floor(Math.random() * bingoSource.length) , 1)[0];
    }
    return column;
  }

  function createColumns() {
    const columns = [];
    for (let row = 0; row < 5; row++) {
      columns.push(createColumn(row));
      // columns[row] = createColumn(row);
    }
    // columns[0] = createColumn(0);
    // columns[1] = createColumn(1);
    // columns[2] = createColumn(2);
    // columns[3] = createColumn(3);
    // columns[4] = createColumn(4);
    columns[2][2] = 'FREE';
    return columns;
  }

  // function createBingo(columns) {
  //   const bingo = [];
  //   for (let row = 0; row < 5; row++) {
  //     bingo[row] = [];
  //     for (let col = 0; col < 5; col++) {
  //       bingo[row][col] = columns[col][row];
  //     }
  //   }
  //   return bingo;
  // }

  function renderBingo(columns) {
    for (let row = 0; row < 5; row++) {
      const tr = document.createElement('tr');
      for (let col = 0; col < 5; col++) {
        const td = document.createElement('td');
        td.textContent = columns[col][row];
        tr.appendChild(td);
      }
      document.querySelector('tbody').appendChild(tr);
    }
  }

  let columns = createColumns();
  // const bingo = createBingo(columns);

  renderBingo(columns);


  //DICE生成

  let diceSources = [];
  for (let i = 0; i < 75; i++) {
    diceSources.push(i + 1);
  }

  //各BUTTON挙動
  const diceStart = document.querySelector('#dice-start');
  const diceStop = document.querySelector('#dice-stop');
  const diceNumber = document.querySelector('#dice-number');
  const ths = document.querySelectorAll('th');
  const reset = document.querySelector('#reset');

  let diceIntervalId;
  let diceTimeoutId;
  // let winningNumber;

  //メモ化してあるのがspliceを使用しての処理
  //※spliceにdiceNumberを使って抜き出すとなぜか表示されている数値と
  //抜き出すがずれる為ランダム生成したものをdiceNumberに再代入し再描画している。

  //現状実行されるのが、filterを使った処理

  //bingoNumberにpushする数値はどちらもnumberに、文字列でもよいかも

  function stopButtonProcess() {
    clearInterval(diceIntervalId);
    diceSources = diceSources.filter(dice => {
      return Number(diceNumber.textContent) !== dice;
    });
    // winningNumber = diceSources.splice(Math.floor(Math.random() * diceSources.length) - 1, 1);
    // diceNumber.textContent = winningNumber[0];
    diceStart.disabled = false;
    diceStop.disabled = true;
    reset.disabled = false;

    const tds = document.querySelectorAll('td');
    tds.forEach(td => {
      if (td.textContent === diceNumber.textContent) {
        // if (Number(td.textContent) === winningNumber[0]) {
        td.classList.add('hit');
      }
    });
  }

  //BINGO時の各種処理

  function bingoTextChange() {
    diceNumber.textContent = 'BINGO';
    diceStart.disabled = true;
    // reset.disabled = true;
    
      // const bingoStopIntervalId =setInterval(() => {
      //   diceNumber.classList.toggle('bingo');
      //   ths.forEach(th => {
      //     th.classList.toggle('bingo');
      //     setTimeout(() => {
      //       clearInterval(bingoStopIntervalId);
      //       reset.disabled = false;
      //     }, 10000);
      //   });
      // }, 1000);
      reset.disabled = false;
   
  }

  function bingoProsess() {
    const tds = document.querySelectorAll('td');
    //rowのBINGO処理
    const tdsCopy = [...tds];
  
    const tdsRows = [];
  
    for (let i = 0; i < 5; i++) {
      tdsRows.push(tdsCopy.splice(0, 5));
    }
  
    tdsRows.forEach(rows => {
      rows.forEach(() => {
        if (
          rows[0].classList.contains('hit') &&
          rows[1].classList.contains('hit') &&
          rows[2].classList.contains('hit') &&
          rows[3].classList.contains('hit') &&
          rows[4].classList.contains('hit')
        ) {
          bingoTextChange();
        }  
      })
    });
  
    //colのBINGO処理
    const tdsCols = [];

    for (let row = 0; row < 5; row++) {
      tdsCols[row] = [];
      for (let col = 0; col < 5; col++) {
        tdsCols[row][col] = tdsRows[col][row];
      }
    }
   
    tdsCols.forEach(cols => {
      cols.forEach(() => {
        if (
          cols[0].classList.contains('hit') &&
          cols[1].classList.contains('hit') &&
          cols[2].classList.contains('hit') &&
          cols[3].classList.contains('hit') &&
          cols[4].classList.contains('hit')
        ) {
          bingoTextChange();
        }  
      })
    });
    
    //斜めラインのBINGO処理
    if (
      tds[0].classList.contains('hit') &&
      tds[6].classList.contains('hit') &&
      tds[12].classList.contains('hit') &&
      tds[18].classList.contains('hit') &&
      tds[24].classList.contains('hit') ||
      tds[4].classList.contains('hit') &&
      tds[8].classList.contains('hit') &&
      tds[12].classList.contains('hit') &&
      tds[16].classList.contains('hit') &&
      tds[20].classList.contains('hit') 
    ) {
      bingoTextChange();
    }
  }

  //BINGOのBUTTON処理
  diceStart.addEventListener('click', () => {
    diceIntervalId = setInterval(() => {
      diceNumber.textContent = diceSources[Math.floor(Math.random() * diceSources.length)];
    }, 100);

    diceTimeoutId = setTimeout(() => {
      stopButtonProcess();
      bingoProsess();
    }, 15000);

    const tds = document.querySelectorAll('td');
    tds.forEach(td => {
      if (td.textContent === 'FREE' && !td.classList.contains('open')) {
        td.classList.add('hit');
      }
    });

    diceStart.disabled = true;
    diceStop.disabled = false;
    reset.disabled = true;
  });

  diceStop.addEventListener('click', () => {
    clearTimeout(diceTimeoutId);
    stopButtonProcess();
    bingoProsess();
  });

  reset.addEventListener('click', () => {
    if (confirm('Sure?')) {
      diceSources = [];
      for (let i = 0; i < 75; i++) {
        diceSources.push(i + 1);
      }

      const tbody = document.querySelector('tbody');
      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }

      ths.forEach(th => {
        th.classList.remove('bingo');
      });

      diceNumber.classList.remove('bingo');
      diceNumber.textContent = '1';
      diceStart.disabled = false;
      diceStop.disabled = true;
      reset.disabled = true;

      columns = createColumns();
      renderBingo(columns);
    }
  });
}