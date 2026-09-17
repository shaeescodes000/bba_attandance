(function(){
  const STORE_KEY = 'attendance_students_v1';
  const RECORDS_KEY = 'attendance_records_v1';
  const RESET_FLAG = 'attendance_reset_fall25_v2';

  function loadStudents(){
    try{
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){ return []; }
  }
  function saveStudents(list){
    try{ localStorage.setItem(STORE_KEY, JSON.stringify(list)); }catch(e){}
  }
  function loadRecords(){
    try{
      const raw = localStorage.getItem(RECORDS_KEY);
      return raw ? JSON.parse(raw) : {};
    }catch(e){ return {}; }
  }
  function saveRecords(rec){
    try{ localStorage.setItem(RECORDS_KEY, JSON.stringify(rec)); }catch(e){}
  }

  const DEFAULT_STUDENTS = [
    ["F25-BBA-0002","Syeda Naeema Khalid Gillani"],
    ["F25-BBA-0004","Amina Nadeem"],
    ["F25-BBA-0005","Tooba Ashfaq"],
    ["F25-BBA-0006","Sadia Liaqat"],
    ["F25-BBA-0008","Zeeshan"],
    ["F25-BBA-0009","Ali Hamza"],
    ["F25-BBA-0010","Muhammad Ahsan"],
    ["F25-BBA-0011","Areeba Asmat"],
    ["F25-BBA-0013","Irtaza Hassan"],
    ["F25-BBA-0014","Zuha Khan"],
    ["F25-BBA-0015","Muhammad Anus"],
    ["F25-BBA-0017","Isma Rasool"],
    ["F25-BBA-0018","Javeria"],
    ["F25-BBA-0019","Ayesha Tariq"],
    ["F25-BBA-0020","Hassan Ali"],
    ["F25-BBA-0022","Kiran Shahnaz"],
    ["F25-BBA-0023","Mahad Khan"],
    ["F25-BBA-0024","Maham"],
    ["F25-BBA-0026","Muhammad Ayan Naveed"],
    ["F25-BBA-0027","Hafiz Hassan Daniyal"],
    ["F25-BBA-0029","Qaisar Ali Javed"],
    ["F25-BBA-0035","Palwisha Anwar"],
    ["F25-BBA-0038","Sajida Sabir"],
    ["F25-BBA-0039","Arfa Tahir"],
    ["F25-BBA-0041","Laiba Zaheer"],
    ["F25-BBA-0042","Muhammad Ilyas"],
    ["F25-BBA-0043","Abdullah"],
    ["F25-BBA-0044","Muhammad Usman"],
    ["F25-BBA-0045","Muhammad Arsalan Mehmood"],
    ["F25-BBA-0046","Hafiza Maryam Amir"],
    ["F25-BBA-0050","Abrar Hussain"],
    ["F25-BBA-0051","Muhammad Sahar Rasheed"],
    ["F25-BBA-0052","Adnan Ramzan"],
    ["F25-BBA-0053","Nimrah Iqbal"],
    ["F25-BBA-0054","Syed Aoun Haider"],
    ["F25-BBA-0059","Zain Aslam"],
    ["F25-BBA-0061","Samia Altaf"],
    ["F25-BBA-0062","Muhammad Ammar Shafi"],
    ["F25-BBA-0064","Muhammad Talha Khalid"],
    ["F25-BBA-0065","Shaees Ur Rehman"],
    ["F25-BBA-0067","Muhammad Awais Qarni"],
    ["F25-BBA-0069","Rai Maaz Ahmed"],
    ["F25-BBA-0070","Laiba Ramzan"],
    ["F25-BBA-0073","Syed Zaib Hussain"],
    ["F25-BBA-0076","Umm E Rubab"],
    ["F25-BBA-0077","Musa Rashid"]
  ];

  let students = loadStudents();

  if(!localStorage.getItem(RESET_FLAG)){
    students = DEFAULT_STUDENTS.map(function(pair, idx){
      return { id: 'stu_f25_' + idx + '_' + pair[0], name: pair[1], cms: pair[0] };
    });
    saveStudents(students);
    saveRecords({});
    localStorage.setItem(RESET_FLAG, '1');
  }

  let records = loadRecords();

  const dateInput = document.getElementById('dateInput');
  const today = new Date().toISOString().slice(0,10);
  dateInput.value = today;

  const nameInput = document.getElementById('nameInput');
  const cmsInput = document.getElementById('cmsInput');
  const addBtn = document.getElementById('addBtn');
  const tbody = document.getElementById('tbody');
  const emptyMsg = document.getElementById('emptyMsg');
  const statsBar = document.getElementById('statsBar');

  function currentDateRecords(){
    const d = dateInput.value;
    if(!records[d]) records[d] = {};
    return records[d];
  }

  function setStatus(id, status){
    const dayRec = currentDateRecords();
    dayRec[id] = status;
    saveRecords(records);
    render();
  }

  function render(){
    tbody.innerHTML = '';
    emptyMsg.style.display = students.length === 0 ? 'block' : 'none';
    const dayRec = currentDateRecords();
    let pCount = 0, aCount = 0;

    students.forEach(function(s){
      const status = dayRec[s.id] || '';
      if(status === 'P') pCount++;
      if(status === 'A') aCount++;

      const tr = document.createElement('tr');

      const nameTd = document.createElement('td');
      nameTd.className = 'name-cell';
      nameTd.textContent = s.name;
      tr.appendChild(nameTd);

      const cmsTd = document.createElement('td');
      cmsTd.className = 'cms-cell';
      cmsTd.textContent = s.cms || '-';
      tr.appendChild(cmsTd);

      const statusTd = document.createElement('td');
      const btnWrap = document.createElement('div');
      btnWrap.className = 'status-btns';

      const pBtn = document.createElement('button');
      pBtn.className = 'pill' + (status === 'P' ? ' p-active' : '');
      pBtn.textContent = 'P';
      pBtn.onclick = function(){ setStatus(s.id, status === 'P' ? '' : 'P'); };

      const aBtn = document.createElement('button');
      aBtn.className = 'pill' + (status === 'A' ? ' a-active' : '');
      aBtn.textContent = 'A';
      aBtn.onclick = function(){ setStatus(s.id, status === 'A' ? '' : 'A'); };

      btnWrap.appendChild(pBtn);
      btnWrap.appendChild(aBtn);
      statusTd.appendChild(btnWrap);
      tr.appendChild(statusTd);

      const delTd = document.createElement('td');
      const delBtn = document.createElement('button');
      delBtn.className = 'del-btn';
      delBtn.textContent = '✕';
      delBtn.title = 'Remove student';
      delBtn.onclick = function(){
        if(confirm('Remove ' + s.name + '?')){
          students = students.filter(function(x){ return x.id !== s.id; });
          saveStudents(students);
          render();
        }
      };
      delTd.appendChild(delBtn);
      tr.appendChild(delTd);

      tbody.appendChild(tr);
    });

    statsBar.innerHTML = 'Total: <b>' + students.length + '</b> | Present: <b>' + pCount + '</b> | Absent: <b>' + aCount + '</b>';
  }

  addBtn.addEventListener('click', function(){
    const name = nameInput.value.trim();
    const cms = cmsInput.value.trim();
    if(!name){
      nameInput.focus();
      return;
    }
    students.push({ id: 'stu_' + Date.now() + '_' + Math.random().toString(36).slice(2,7), name: name, cms: cms });
    saveStudents(students);
    nameInput.value = '';
    cmsInput.value = '';
    nameInput.focus();
    render();
  });

  nameInput.addEventListener('keydown', function(e){ if(e.key === 'Enter'){ cmsInput.focus(); } });
  cmsInput.addEventListener('keydown', function(e){ if(e.key === 'Enter'){ addBtn.click(); } });

  document.getElementById('markAllP').addEventListener('click', function(){
    const dayRec = currentDateRecords();
    students.forEach(function(s){ dayRec[s.id] = 'P'; });
    saveRecords(records);
    render();
  });
  document.getElementById('markAllA').addEventListener('click', function(){
    const dayRec = currentDateRecords();
    students.forEach(function(s){ dayRec[s.id] = 'A'; });
    saveRecords(records);
    render();
  });

  dateInput.addEventListener('change', render);

  document.getElementById('downloadBtn').addEventListener('click', function(){
    const d = dateInput.value;
    const dayRec = currentDateRecords();
    let csv = 'Name,CMS Number,Date,Status\n';
    students.forEach(function(s){
      const status = dayRec[s.id] || 'Not Marked';
      const safeName = '"' + s.name.replace(/"/g,'""') + '"';
      csv += safeName + ',' + (s.cms || '') + ',' + d + ',' + status + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_' + d + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  render();
})();