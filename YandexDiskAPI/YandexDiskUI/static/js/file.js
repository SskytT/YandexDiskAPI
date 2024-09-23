        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

        async function getPublicKeyAndPath()
        {
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
                    const response = await fetch(ActionUrl);
                    if (response.ok)
                    {
                        const data = await response.json();
                        console.log('Ответ JSON:', data);
                        document.querySelector('h1').textContent = data.name || 'Список файлов';
                        if (data.items && Array.isArray(data.items)) {
                            const fileList = document.getElementById('file-list');
                            fileList.innerHTML = '';
                            for (const item of data.items)
                            {
                                const li = document.createElement('li');
                                li.classList.add('file-item');

                                const fileType = item.type === 'dir' ? 'dir' : getFileType(item.name);
                                li.dataset.type = fileType;
                                const icon = document.createElement('img');
                                icon.src = fileIcons[fileType] || fileIcons['default'];
                                li.appendChild(icon);

                                const fileName = document.createElement('p');
                                fileName.textContent = item.name;
                                li.appendChild(fileName);

                                if (item.file)
                                {
                                    const downloadButton = document.createElement('button');
                                    downloadButton.textContent = 'Скачать';
                                    downloadButton.onclick = () => handleDownloadButtonClick(item.file);
                                    li.appendChild(downloadButton);
                                }
                                else
                                {
                                    const downloadButton = document.createElement('button');
                                    downloadButton.textContent = 'Скачать';
                                    let dataDownload = await getDirDownloadLink(item.path, data.public_key);
                                    downloadButton.onclick = () => handleDownloadButtonClick(dataDownload.download);
                                    li.appendChild(downloadButton);
                                }

                                if (item.type === 'dir')
                                {
                                    const openButton = document.createElement('button');
                                    openButton.textContent = 'Открыть';
                                    openButton.onclick = () => handleOpenButtonClick(data.public_key, item.path);
                                    li.appendChild(openButton);
                                }

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

        function getFileType(filename) {
            const extension = filename.split('.').pop().toLowerCase();
            return imageExtensions.includes(extension) ? 'image' : 'default';
        }

        function handleDownloadButtonClick(file)
        {
            const link = document.createElement('a');
            link.href = file;
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        async function getDirDownloadLink(downloadPath, downloadPublicKey)
        {
            let ActionDownloadUrl = downloadUrl;
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

        function handleOpenButtonClick(publicKey, newPath)
        {
            newPath = btoa(encodeURIComponent(newPath));
            publicKey = btoa(encodeURIComponent(publicKey));
            window.history.pushState({}, '', `/file/${publicKey}/${newPath}/`);
            getPublicKeyAndPath();
        }

        document.addEventListener('DOMContentLoaded', function()
        {
            getPublicKeyAndPath();
        });

        window.addEventListener('popstate', function(event)
        {
            getPublicKeyAndPath();
        });

        document.getElementById('backButton').addEventListener('click', function()
        {
            window.history.back();
        });

        document.getElementById('fileForm').addEventListener('submit', function(event)
        {
            event.preventDefault();
            let newPublicKey = document.getElementById('public_key').value.trim();
            let newPath = document.getElementById('path').value.trim();
            if (!newPath)
            {
                newPath = '/';
            }
            newPublicKey = btoa(encodeURIComponent(newPublicKey));
            newPath = btoa(encodeURIComponent(newPath));
            window.history.pushState({}, '', `/file/${newPublicKey}/${newPath}/`);
            getPublicKeyAndPath();
        });

        function applyFilter() {
            const filterValue = document.getElementById('filter').value;
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

        document.getElementById('filter').addEventListener('change', applyFilter);