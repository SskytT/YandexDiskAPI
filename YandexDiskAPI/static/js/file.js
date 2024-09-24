        //масив для определения типа "изображение"
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

        //функция для обновления списка файлов
        async function getPublicKeyAndPath()
        {
            //получаем данные из url
            const path = window.location.pathname;
            const regex = /^\/file\/([^\/]+)\/(.+)\/?$/;
            const match = path.match(regex);
            if (match)
            {
                const publicKey = match[1];
                let filePath = match[2];
                if (filePath.endsWith('/'))
                {
                    filePath = filePath.slice(0, -1);
                }
                console.log('Public Key:', publicKey);
                console.log('Path:', filePath);
                try
                {
                    let ActionUrl = staticUrl;
                    ActionUrl = ActionUrl.replace('public_key', publicKey).replace('path', filePath);
                    console.log(ActionUrl);
                    //запрос на получение списка файлов
                    const response = await fetch(ActionUrl);
                    if (response.ok)
                    {
                        const data = await response.json();
                        console.log('Ответ JSON:', data);
                        document.querySelector('h1').textContent = data.name || 'Список файлов';
                        if (data.items && Array.isArray(data.items)) {
                            const fileList = document.getElementById('file-list');
                            fileList.innerHTML = '';
                            //проходимся по всем файлам
                            for (const item of data.items)
                            {
                                const li = document.createElement('li');
                                li.classList.add('file-item');
                                //определяем тип
                                const fileType = item.type === 'dir' ? 'dir' : getFileType(item.name);
                                li.dataset.type = fileType;
                                const icon = document.createElement('img');
                                icon.src = fileIcons[fileType] || fileIcons['default'];

                                li.appendChild(icon);

                                const fileName = document.createElement('p');
                                fileName.textContent = item.name;
                                li.appendChild(fileName);
                                //если объект - файл в кнопку просто пихаем ссылку на скачивание
                                if (item.file)
                                {
                                    const downloadButton = document.createElement('button');
                                    downloadButton.textContent = 'Скачать';
                                    downloadButton.onclick = () => handleDownloadButtonClick(item.file);
                                    li.appendChild(downloadButton);
                                }
                                //иначе мы получаем эту ссылку с помощью запроса
                                else
                                {

                                    const downloadButton = document.createElement('button');
                                    downloadButton.textContent = 'Скачать';
                                    //получаем ссылку для скачивания папки
                                    let dataDownload = await getDirDownloadLink(item.path, data.public_key);
                                    downloadButton.onclick = () => handleDownloadButtonClick(dataDownload.download);
                                    li.appendChild(downloadButton);
                                }
                                //если файл - папка, то добавляем кнопку открыть
                                if (item.type === 'dir')
                                {
                                    const openButton = document.createElement('button');
                                    openButton.textContent = 'Открыть';
                                    openButton.onclick = () => handleOpenButtonClick(data.public_key, item.path);
                                    li.appendChild(openButton);
                                }
                                //добавляем получившийся элемент
                                fileList.appendChild(li);
                            }
                        }
                        else
                        {
                            console.log('Items не найдены или имеют неправильный формат.');
                        }
                    }
                    else
                    {
                        console.log('Ошибка ответа от сервера:', response.status);
                    }
                }
                catch(error)
                {
                    console.error('Ошибка запроса:', error);
                }
            }
            else
            {
                console.log('URL не соответствует ожидаемому шаблону.');
            }
        }
        //функция получения типа по расширению
        function getFileType(filename) {
            const extension = filename.split('.').pop().toLowerCase();
            return imageExtensions.includes(extension) ? 'image' : 'default';
        }
        //функция переходит на ссылку для скачивания
        function handleDownloadButtonClick(file)
        {
            const link = document.createElement('a');
            link.href = file;
            link.download = '';
            document.body.appendChild(link);
            //переходим по ссылке
            link.click();
            //удаляем ссылку
            document.body.removeChild(link);
        }
        //функция получения ссылки на скачивание
        async function getDirDownloadLink(downloadPath, downloadPublicKey)
        {
            let ActionDownloadUrl = downloadUrl;
            //кодируем файлы
            downloadPath = btoa(encodeURIComponent(downloadPath));
            downloadPublicKey = btoa(encodeURIComponent(downloadPublicKey));
            ActionDownloadUrl = ActionDownloadUrl.replace('public_key', downloadPublicKey)
                                                 .replace('path', downloadPath);
            console.log(ActionDownloadUrl);
            try
            {
                const responseDownload = await fetch(ActionDownloadUrl);
                if (responseDownload.ok)
                {
                    //делаем запрос для получения ссылки на скачивания
                    const dataDownload = await responseDownload.json();
                    console.log(dataDownload.download);
                    return dataDownload;
                }
                else
                {
                    console.log('Ошибка ответа от сервера:', responseDownload.status);
                }
            }
            catch(error)
            {
                console.error('Ошибка запроса:', error);
            }
        }
        //функция срабатывает при нажатии на кнопку открыть
        function handleOpenButtonClick(publicKey, newPath)
        {
            //кодируем данные в url и в base64
            newPath = btoa(encodeURIComponent(newPath));
            publicKey = btoa(encodeURIComponent(publicKey));
            //меняем url
            window.history.pushState({}, '', `/file/${publicKey}/${newPath}/`);
            getPublicKeyAndPath();
        }
        //при загрузки страницы обновляем список
        document.addEventListener('DOMContentLoaded', function()
        {
            getPublicKeyAndPath();
        });
        //при измении url обновляем список
        window.addEventListener('popstate', function(event)
        {
            getPublicKeyAndPath();
        });
        //кнопка назад
        document.getElementById('backButton').addEventListener('click', function()
        {
            window.history.back();
        });
        //срабатывает при нажатии на кнопку получить файлы и обновляет список
        document.getElementById('fileForm').addEventListener('submit', function(event)
        {
            event.preventDefault();
            //получаем данные для получения файла
            let newPublicKey = document.getElementById('public_key').value.trim();
            let newPath = document.getElementById('path').value.trim();
            //если пути нет то ставим дефолтный
            if (!newPath)
            {
                newPath = '/';
            }
            //шифруем в url  потом в base64
            newPublicKey = btoa(encodeURIComponent(newPublicKey));
            newPath = btoa(encodeURIComponent(newPath));
            //меняем url
            window.history.pushState({}, '', `/file/${newPublicKey}/${newPath}/`);
            getPublicKeyAndPath();
        });
        //функция для фильтрации
        function applyFilter() {
            const filterValue = document.getElementById('filter').value;
            //получаем все объекты в списке
            const fileItems = document.querySelectorAll('.file-item');
            console.log(fileItems);
            fileItems.forEach(item => {
                const fileType = item.dataset.type; // Предполагаем, что тип файла хранится в data-атрибуте
                if (filterValue === 'all' || fileType === filterValue) {
                    item.style.display = 'block'; // Показываем элемент
                } else {
                    item.style.display = 'none'; // Скрываем элемент
                }
            });
        }
        //добавляем прослушивание изменения списка для фильтрации
        document.getElementById('filter').addEventListener('change', applyFilter);