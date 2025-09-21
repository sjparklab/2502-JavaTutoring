const apiBase = 'http://127.0.0.1:8080/students';

function setLoading(element, isLoading, originalText) {
  if (isLoading) {
    element.innerHTML = `<span class="loading"></span>처리중...`;
    element.disabled = true;
  } else {
    element.innerHTML = originalText;
    element.disabled = false;
  }
}

async function loadStudents() {
  try {
    const res = await fetch(apiBase);
    const students = await res.json();
    const tbody = document.getElementById('studentTableBody');
    
    if (students.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-state">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h3>등록된 학생이 없습니다</h3>
            <p>위 폼을 사용하여 첫 번째 학생을 등록해보세요!</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = '';
    students.forEach((s, index) => {
      const tr = document.createElement('tr');
      tr.className = 'fade-in';
      tr.style.animationDelay = `${index * 0.1}s`;
      
      tr.innerHTML = `
        <td><strong>#${s.id}</strong></td>
        <td><input class="table-input" value="${s.studentName || ''}" id="name-${s.id}" placeholder="이름 입력"></td>
        <td><input class="table-input" value="${s.studentNumber || ''}" id="number-${s.id}" placeholder="학번 입력"></td>
        <td><input class="table-input" value="${s.studentMajor || ''}" id="major-${s.id}" placeholder="전공 입력"></td>
        <td><input class="table-input" type="number" value="${s.studentYear || ''}" id="year-${s.id}" min="1" max="4" placeholder="학년"></td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-success" onclick="updateStudent(${s.id})" id="update-btn-${s.id}">
              수정
            </button>
            <button class="btn btn-danger" onclick="deleteStudent(${s.id})" id="delete-btn-${s.id}">
              삭제
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('학생 목록 로드 실패:', error);
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: #dc3545; padding: 40px;">
          ❌ 데이터를 불러오는데 실패했습니다. 서버 연결을 확인해주세요.
        </td>
      </tr>
    `;
  }
}

function initializeForm() {
  document.getElementById('studentForm').addEventListener('submit', async e => {
    e.preventDefault();
    const addButton = document.querySelector('#studentForm button');
    
    setLoading(addButton, true, '학생 추가');
    
    try {
      const student = {
        studentName: document.getElementById('name').value,
        studentNumber: document.getElementById('number').value,
        studentMajor: document.getElementById('major').value,
        studentYear: parseInt(document.getElementById('year').value) || null
      };
      
      const response = await fetch(apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
      });
      
      if (response.ok) {
        e.target.reset();
        await loadStudents();
        showSuccess(addButton, '✅ 추가 완료!', '학생 추가');
      } else {
        throw new Error('서버 오류');
      }
    } catch (error) {
      console.error('학생 추가 실패:', error);
      showError(addButton, '❌ 추가 실패', '학생 추가');
    } finally {
      setLoading(addButton, false, '학생 추가');
    }
  });
}

async function updateStudent(id) {
  const updateButton = document.getElementById(`update-btn-${id}`);
  setLoading(updateButton, true, '수정');
  
  try {
    const student = {
      studentName: document.getElementById(`name-${id}`).value,
      studentNumber: document.getElementById(`number-${id}`).value,
      studentMajor: document.getElementById(`major-${id}`).value,
      studentYear: parseInt(document.getElementById(`year-${id}`).value) || null
    };
    
    const response = await fetch(`${apiBase}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    
    if (response.ok) {
      showSuccess(updateButton, '✅ 완료', '수정');
    } else {
      throw new Error('수정 실패');
    }
  } catch (error) {
    console.error('학생 수정 실패:', error);
    showError(updateButton, '❌ 실패', '수정');
  } finally {
    setLoading(updateButton, false, '수정');
  }
}

async function deleteStudent(id) {
  if (!confirm('정말로 이 학생을 삭제하시겠습니까?')) {
    return;
  }
  
  const deleteButton = document.getElementById(`delete-btn-${id}`);
  setLoading(deleteButton, true, '삭제');
  
  try {
    const response = await fetch(`${apiBase}/${id}`, { 
      method: 'DELETE' 
    });
    
    if (response.ok) {
      await loadStudents();
    } else {
      throw new Error('삭제 실패');
    }
  } catch (error) {
    console.error('학생 삭제 실패:', error);
    showError(deleteButton, '❌ 실패', '삭제');
  } finally {
    setLoading(deleteButton, false, '삭제');
  }
}

function showSuccess(button, message, originalText) {
  const originalBg = button.style.background;
  button.style.background = 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)';
  button.innerHTML = message;
  setTimeout(() => {
    button.style.background = originalBg;
    button.innerHTML = originalText;
  }, 2000);
}

function showError(button, message, originalText) {
  const originalBg = button.style.background;
  button.style.background = 'linear-gradient(135deg, #e17055 0%, #d63031 100%)';
  button.innerHTML = message;
  setTimeout(() => {
    button.style.background = originalBg;
    button.innerHTML = originalText;
  }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  initializeForm();
  loadStudents();
});